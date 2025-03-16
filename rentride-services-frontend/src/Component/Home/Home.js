import Navbar from "../Navbar/Navbar";
import "./Home.css";
const Home = () => {
  return (
    <>
      <Navbar />
      <div className="Hmain">
        <div className="upper">
          <div className="Hfirst">
            <h1 className="text-2xl font-bold">
              Welcome,
              <br />
              ...................We are RentRide Services.
            </h1>
            <br />
            <p>
              RentRide Services is the go-to website for all your vehicle needs.
              Our platform offers a wide range of services, including the
              hassle-free booking of cars. We
              prioritize customer satisfaction by providing a seamless
              experience for browsing, booking, and comparing services.
            </p>
            <br />
            <p>We do provide you vehicle Comparision feature.</p>
            <br />
            <div className="text-center">
              <a
                href="/compare"
                className="bg-white  text-black border-4 border-gray-400 hover:bg-black hover:text-white hover:border-white font-bold py-1 px-2 rounded-xl "
              >
                <i className="fas fa-car"> </i> Compare
              </a>
            </div>
          </div>
          <div className="Hsecond">
            <img
              alt="backimage"
              src="https://www.byways.org/wp-content/uploads/tires/215-40r16_tire.jpg"
            />
          </div>
        </div>

        <div className="grid p-3 aboutus">
          <div className="flex p-3">
            <div className=" about">
              <h3 className="text-3xl font-bold text-white text-center">
                About us
              </h3>
              <p className="text-white">
                Our platform offers a wide range of services, including the
                hassle-free booking of rental vehicles like cars.
                We prioritize customer satisfaction by providing a seamless
                experience for browsing, booking, and comparing services.
              </p>
            </div>
            <div className="mapouter">
              <h3 className="text-3xl font-bold text-white text-center">
                Visit us
              </h3>
              <br />
              <div className="gmap_canvas">
                <iframe
                  width="400"
                  height="400"
                  id="gmap_canvas"
                  src="https://maps.google.com/maps?q=satdobato&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  frameborder="0"
                  scrolling="no"
                  marginheight="0"
                  marginwidth="0"
                ></iframe>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
