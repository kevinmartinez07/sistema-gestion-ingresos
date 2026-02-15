import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className='min-h-screen bg-white'>
      <div className='bg-gray-900 text-white py-6 px-4'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold mb-2'>Documentación de API</h1>
          <p className='text-gray-300'>
            Sistema de Gestión de Ingresos y Egresos - API REST
          </p>
        </div>
      </div>
      <div className='max-w-7xl mx-auto'>
        <SwaggerUI url='/api/openapi' />
      </div>
    </div>
  );
}
