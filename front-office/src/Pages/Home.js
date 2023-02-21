import React from "react";
import Product_Carousel from "../Components/Product_Carousel";
import Community_Feed from "./Community_Feed.js";
import Service from '../Components/Service.js';

export default function Home(props)
{
    return(
        <div className="container mt-5">
          <div id="animal-select" className="row mx-3">
            <div className="col-sm-3">
              <div className="animal-card">
                <a href="/results" role="link">
                  <img width="60%" src="/img/dog.png" alt="Picture of a dog"/>
                </a>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="animal-card">
                <a href="/results" role="link">
                  <img width="60%" src="/img/bird.png" alt="Picture of a bird"/>
                </a>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="animal-card">
                <a href="/results" role="link">
                  <img width="60%" src="/img/clown-fish.png" alt="Picture of a clown fish"/>
                </a>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="animal-card">
                <a href="/results" role="link">
                  <img width="60%" src="/img/tiger.png" alt="Picture of a tiger"/>
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
            <Service short={true} service={props.services[0]} />
          </div>
          <div className="row">
            <a href="/services">More Services</a>
          </div>
          <Community_Feed />
        </div>
    )
}