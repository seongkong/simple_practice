import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import back1 from '../Assets/1.svg';
import back2 from '../Assets/2.svg';
import back3 from '../Assets/3.svg';

const Slick = () => {

  
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // 추가된 부분
    autoplaySpeed: 3000, // 슬라이드가 자동으로 넘어가는 시간 (밀리초 단위)
  };
    
  return (
      <div>
        <Slider {...settings}>
          <div>
            <h3> <img src={back1} alt='back1' /></h3>
          </div>
          <div>
            <h3> <img src={back2} alt='back2' /></h3>
          </div>
          <div>
            <h3> <img src={back3} alt='back3' /></h3>
          </div>
        </Slider>
      </div>
  );
  
};

export default Slick;