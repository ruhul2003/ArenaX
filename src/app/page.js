import Banner from "./components/Banner";
import Featured from "./components/Featured";
import Offers from "./components/Offers";
import WhyChooseUs from "./components/WhyChooseUs";


export default function Home() {
  return (
    <div>
      <Banner />
      <Featured />
      <WhyChooseUs /> 
      <Offers />
    </div>
  );
}
