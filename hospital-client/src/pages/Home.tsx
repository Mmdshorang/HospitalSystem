import { Link } from "react-router-dom";
import Logo from "../../public/ImamAli.png";
import Clinic from "../../public/clinic.png";

export const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="flex justify-center items-center py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <img src={Logo} alt="Logo" className="w-60 h-50 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-6">
              به درمانگاه امام علی خوش آمدید
            </h1>
            <p className="text-xl mb-8 text-primary-500">
              درمانگاه شبانه‌روزی امام علی (ع) دزفول - ارائه خدمات جامع سلامت
            </p>
          </div>
        </div>
        <div className="w-1/2 h-full object-cover ml-10 hidden md:block">
          <img
            src={Clinic}
            alt="Clinic"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            خدمات ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-[500px]">
            <Link
              to={"/services"}
              className="border-2 border-black card hover:shadow-lg transition-shadow duration-300 cursor-pointer w-[80%] mx-auto"
            >
              <div className="items-center gap-4">
                <div
                  className={`w-100 h-100 rounded-lg flex items-center justify-center text-3xl`}
                >
                  <img
                    src={"/visit.png"}
                    alt="Doctor"
                    className="w-full h-100"
                  />
                </div>
                <div className="flex-1 w-full p-5 text-center">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    ویزیت پزشک
                  </h3>
                  <p className="text-gray-600">
                    رزرو نوبت ویزیت حضوری و آنلاین
                  </p>
                </div>
              </div>
            </Link>
            <Link
              to={"/services"}
              className="border-2 border-black card hover:shadow-lg transition-shadow duration-300 cursor-pointer w-[80%] mx-auto"
            >
              <div className="items-center gap-4">
                <div
                  className={`w-100 h-100 rounded-lg flex items-center justify-center text-3xl`}
                >
                  <img
                    src={"/paraclinic.png"}
                    alt="Doctor"
                    className="w-full h-100"
                  />
                </div>
                <div className="flex-1 w-full p-5 text-center">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    خدمات پاراکلینیک
                  </h3>
                  <p className="text-gray-600">خدمات پاراکلینیک با کد رهگیری</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
