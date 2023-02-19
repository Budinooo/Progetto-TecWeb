import React from "react";
import Product_Carousel from "../Components/Product_Carousel";
import Community_Feed from "./Community_Feed.js";

export default function Home(props)
{
    return(
        <div className="container mt-5">
          <div id="animal-select" className="row mx-3">
            <div className="col-sm-3">
              <div className="animal-card">
                <a href="#" role="link">
                  <img width="60%" src="/shop/img/dog.png" alt="Picture of a dog"/>
                </a>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="animal-card">
                <a href="#" role="link">
                  <img width="60%" src="/shop/img/bird.png" alt="Picture of a bird"/>
                </a>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="animal-card">
                <a href="#" role="link">
                  <img width="60%" src="/shop/img/clown-fish.png" alt="Picture of a clown fish"/>
                </a>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="animal-card">
                <a href="#" role="link">
                  <img width="60%" src="/shop/img/tiger.png" alt="Picture of a dog"/>
                </a>
              </div>
            </div>
          </div>
          <div className="row mb-5">
            <h3 className="mb-4">Featured products:</h3>
            <Product_Carousel productList={props.products} />
          </div>
          <div className="row">
            <h3 className="mb-4">Explore our services</h3>
            <div className="d-flex service-container">
              <div className="d-none service-img">
                <img width="100%" src="https://larchmontvillagevet.com/wp-content/uploads/2019/02/grooming-lab-bath-1024x682.jpg" />
              </div>
              <div className="service-body-container">
                <h4 className="service-name"></h4>
                <p className="service-desc"></p>
                <p className="service-price"></p>
                <button className="service-btn"></button>
              </div>
            </div>
          </div>
          <Community_Feed />
        </div>
    )
}