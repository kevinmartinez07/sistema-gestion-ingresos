import { appService } from '@/lib/server/application/ApplicationService';
import { ROLES } from '@/lib/server/domain/value-objects/Role';
import { withAuth } from '@/lib/server/presentation/middlewares/withAuth';
import { withErrorHandling } from '@/lib/server/presentation/middlewares/withErrorHandling';
import { withRole } from '@/lib/server/presentation/middlewares/withRole';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { format } = req.query;

    const [balance, movements] = await Promise.all([
      appService.getBalance.execute(),
      appService.getMovements.execute(),
    ]);

    if (format === 'csv') {
      const csvHeader =
        'ID;Tipo;Monto;Concepto;Fecha;Nombre Usuario;Correo Usuario;Creado\n';
      const csvRows = movements
        .map((m) => {
          const fecha = new Date(m.date).toLocaleDateString('es-ES');
          const creado = new Date(m.createdAt).toLocaleString('es-ES');

          const monto = m.amount.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
          });

          const tipo = m.type === 'INCOME' ? 'Ingreso' : 'Egreso';

          const concepto = m.concept.replace(/"/g, '""');

          const nombreUsuario = m.user?.name || 'Sin nombre';
          const correoUsuario = m.user?.email || 'Sin correo';

          return `${m.id};${tipo};${monto};"${concepto}";${fecha};${nombreUsuario};${correoUsuario};${creado}`;
        })
        .join('\n');

      const csv = csvHeader + csvRows;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="reporte-movimientos-${new Date().toISOString().split('T')[0]}.csv"`
      );
      return res.status(200).send('\uFEFF' + csv);
    }

    return res.status(200).json({
      success: true,
      data: {
        balance: {
          totalIncome: balance.totalIncome,
          totalExpense: balance.totalExpense,
          balance: balance.balance,
        },
        movements: movements.map((m) => ({
          id: m.id,
          type: m.type,
          amount: m.amount,
          concept: m.concept,
          date: m.date,
          userId: m.userId,
          user: m.user,
        })),
      },
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
};

export default withErrorHandling(withAuth(withRole([ROLES.ADMIN])(handler)));
