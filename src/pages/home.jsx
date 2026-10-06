import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-ciruela p-6 font-texto">
      <h1 className="font-titulo text-5xl mb-4">Bienvenida a Lencería Luxury Collection</h1>
      <p className="text-malva mb-8 text-center max-w-md">
        Has iniciado sesión correctamente. Aquí podrás explorar la nueva colección exclusiva.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-rosa-palo text-white font-medium hover:bg-vino transition-all"
      >
        Cerrar sesión (Volver)
      </Link>
    </div>
  );
}