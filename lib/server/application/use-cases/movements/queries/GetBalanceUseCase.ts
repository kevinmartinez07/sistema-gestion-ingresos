import { IMovementRepository } from '../../../repositories/IMovementRepository';
import { GetBalanceRequest } from '../dtos/GetBalanceRequest';
import { GetBalanceResponse } from '../dtos/GetBalanceResponse';

/**
 * Query: Obtener balance financiero
 * Responsabilidad: Calcular ingresos, gastos y balance total
 */
export class GetBalanceUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(query?: GetBalanceRequest): Promise<GetBalanceResponse> {
    const [totalIncome, totalExpense] = await Promise.all([
      this.movementRepository.getTotalIncome(query?.userId),
      this.movementRepository.getTotalExpense(query?.userId),
    ]);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }
}
