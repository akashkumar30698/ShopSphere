import React, { useState, useEffect } from 'react';
import "../App.css";
import image1 from "../assets/images/9742750.jpg";
import image2 from "../assets/images/9766547.jpg";
import image3 from "../assets/images/2853.jpg";

function Banner() {
    const images = [image1, image2, image3];
    const [slideIndex, setSlideIndex] = useState(0);

    // Automatic slide change every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            plusSlides(1); // Move to the next slide
        }, 7000);
        return () => clearInterval(interval); // Cleanup the interval
    }, [slideIndex]);

    const plusSlides = (n) => {
        let newIndex = slideIndex + n;
        if (newIndex >= images.length) {
            newIndex = 0; // Loop back to the first slide
        } else if (newIndex < 0) {
            newIndex = images.length - 1; // Go to the last slide
        }
        setSlideIndex(newIndex);
    };

    const currentSlide = (n) => {
        setSlideIndex(n);
    };

    return (
        <>
            <div className="slideshow-container mb-24">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`mySlides fade ${slideIndex === index ? 'active' : ''}`}
                        style={{ display: slideIndex === index ? 'block' : 'none' }}
                    >
                        <img src={image} className="w-full" alt={`Slide ${index + 1}`} />
                    </div>
                ))}

               
            </div>

            <div style={{ textAlign: "center" }}>
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${slideIndex === index ? 'active' : ''}`}
                        onClick={() => currentSlide(index)}
                    ></span>
                ))}
            </div>
        </>
    );
}

export default Banner;
