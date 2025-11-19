export default function CAPEX({ projectId }: { projectId: number }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">CAPEX</h1>
      <p className="text-gray-600">Módulo en desarrollo para el proyecto {projectId}</p>
    </div>
  );
}
