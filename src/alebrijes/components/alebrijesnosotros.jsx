import Navbar from './navbar';
import Footer from './footer';

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-[#FFF8E7] font-['Alata',sans-serif]">
      
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-10">

        <section className="bg-white w-[60%] mx-auto p-10 rounded-lg text-center">

          <h1 className="text-3xl font-bold text-pink-600 mb-6">
            Sobre nosotros
          </h1>

          <p className="mb-6 text-gray-700 leading-relaxed">
            En <span className="text-pink-500 font-bold">Alebrijes</span> nos apasiona compartir la riqueza cultural y
            natural de México a través de sus destinos turísticos. Nuestro
            catálogo interactivo reúne una gran variedad de lugares emblemáticos
            organizados por estado, con el objetivo de facilitar su exploración
            y dar a conocer la diversidad del país.
          </p>

          {/* Misión */}
          <div className="flex gap-10 my-8 text-left items-start">
            <h3 className="text-purple-700 font-semibold min-w-[100px]">
              Misión
            </h3>

            <p className="text-gray-700">
              Difundir la riqueza cultural, histórica y natural de México mediante una experiencia digital accesible
              que permita a los usuarios explorar y descubrir los principales destinos del país.
            </p>
          </div>

          {/* Visión */}
          <div className="flex gap-10 my-8 text-left items-start">
            <h3 className="text-purple-700 font-semibold min-w-[100px]">
              Visión
            </h3>

            <p className="text-gray-700">
              Ser una plataforma reconocida a nivel nacional por promover el turismo responsable
              y convertirse en un referente digital para quienes desean conocer la diversidad cultural y natural de México.
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <img
              src="https://i.pinimg.com/1200x/38/70/0a/38700a42ea9adf80850f7e9024be0465.jpg"
              alt="Mapa de México"
              className="w-[80%] rounded-lg"
            />
          </div>

        </section>

      </div>
      <Footer />
    </div>
  );
}