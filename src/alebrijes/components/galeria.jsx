import Navbar from './navbar';
import Footer from './footer';

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-[#FFF8E7] font-['Alata',sans-serif]">
      
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-10">

        <section className="bg-white w-[60%] mx-auto p-10 rounded-lg text-center">

          <h1 className="text-3xl font-bold text-pink-600 mb-6">
            Galeria
          </h1>
        </section>

      </div>
      <Footer />
    </div>
  );
}