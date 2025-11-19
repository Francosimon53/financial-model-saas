export default function OPEX({ projectId }: { projectId: number }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">OPEX</h1>
      <p className="text-gray-600">Módulo en desarrollo para el proyecto {projectId}</p>
    </div>
  );
}
