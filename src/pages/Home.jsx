
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faUtensils,
  faTruck,
  faLeaf,
  faUsers,
  faRecycle,
  faArrowRight,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-green-50">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              Together for a Better Tomorrow
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mt-6">
              Don't Waste Food.
              <span className="text-green-600"> Share Hope.</span>
            </h1>

            <p className="text-gray-600 text-lg mt-6 leading-8">
              FoodBridge connects food donors, NGOs, volunteers and
              recovery organisations to reduce food waste and support
              communities in need.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/register"
                className="bg-green-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Join FoodBridge <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Link>

              <a
                href="#how-it-works"
                className="border border-green-600 text-green-700 px-7 py-3 rounded-lg font-semibold hover:bg-green-100"
              >
                Learn More
              </a>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1000"
              alt="Fresh food prepared for sharing"
              className="rounded-2xl shadow-xl w-full h-96 object-cover"
            />
          </div>

        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Making a Difference Together
            </h2>
            <p className="text-gray-500 mt-3">
              Every contribution helps create a better future.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10,000+", label: "Meals Shared", icon: faUtensils },
              { value: "500+", label: "Active Partners", icon: faUsers },
              { value: "200+", label: "Food Donors", icon: faHeart },
              { value: "5,000+", label: "KG Food Recovered", icon: faRecycle },
            ].map((item) => (
              <div key={item.label} className="bg-green-50 p-7 rounded-xl text-center">
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-green-600 text-3xl mb-4"
                />
                <h3 className="text-3xl font-bold text-gray-900">
                  {item.value}
                </h3>
                <p className="text-gray-500 mt-2">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 text-center mt-5">
            Illustrative demo figures. Replace with verified platform data.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1000"
              alt="Volunteers distributing food"
              className="rounded-2xl shadow-lg w-full h-96 object-cover"
            />
          </div>

          <div>
            <p className="text-green-600 font-semibold uppercase tracking-wider">
              About FoodBridge
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-900">
              Turning Surplus Food Into Opportunities
            </h2>

            <p className="text-gray-600 mt-6 leading-8">
              FoodBridge is a food recovery platform designed to connect
              restaurants, supermarkets, hotels and event organisers with
              NGOs and other recovery partners.
            </p>

            <p className="text-gray-600 mt-4 leading-8">
              Our goal is to make surplus food management easier through
              donation requests, location-based matching and collection
              coordination.
            </p>

            <Link
              to="/register"
              className="inline-block mt-7 text-green-700 font-semibold hover:text-green-900"
            >
              Become a Partner <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <p className="text-green-600 font-semibold">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              How FoodBridge Works
            </h2>
            <p className="text-gray-500 mt-3">
              Four simple steps towards reducing food waste.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {[
              {
                icon: faUtensils,
                title: "Donate Food",
                description: "Donors list their available surplus food with quantity and collection details.",
              },
              {
                icon: faUsers,
                title: "Find Partners",
                description: "Verified NGOs and recovery partners discover suitable available donations.",
              },
              {
                icon: faTruck,
                title: "Collect Food",
                description: "Volunteers and partners coordinate collection and delivery.",
              },
              {
                icon: faLeaf,
                title: "Reduce Waste",
                description: "Suitable food is recovered, while unsuitable food is directed to appropriate recovery channels.",
              },
            ].map((step, index) => (
              <div
                key={step.title}
                className="border border-gray-100 shadow-sm p-7 rounded-xl text-center hover:shadow-lg transition"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                  <FontAwesomeIcon icon={step.icon} className="text-green-600 text-2xl" />
                </div>

                <span className="text-green-600 font-bold">
                  STEP 0{index + 1}
                </span>

                <h3 className="text-xl font-bold text-gray-900 mt-3">
                  {step.title}
                </h3>

                <p className="text-gray-500 mt-3 leading-7">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recovery Categories */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold">Responsible Recovery</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Every Resource Has a Purpose
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: faHandHoldingHeart,
                title: "Human Consumption",
                description: "Suitable surplus food can be donated to people through verified organisations.",
              },
              {
                icon: faUtensils,
                title: "Animal Feed",
                description: "Eligible food materials can be directed to approved animal-feed handlers.",
              },
              {
                icon: faLeaf,
                title: "Composting",
                description: "Appropriate organic waste can be processed into useful compost.",
              },
              {
                icon: faRecycle,
                title: "Biogas",
                description: "Suitable organic waste can be sent for biogas production.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-7 rounded-xl shadow-sm">
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-green-600 text-3xl mb-5"
                />
                <h3 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-500 mt-3 leading-7">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Food eligibility must be assessed according to applicable food
            safety and recovery requirements.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Be Part of the Change
          </h2>

          <p className="text-green-100 mt-5 text-lg leading-8">
            Join FoodBridge and help connect surplus food with the people
            and organisations that can use it responsibly.
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 bg-white text-green-700 px-8 py-3 rounded-lg font-bold hover:bg-green-50"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
