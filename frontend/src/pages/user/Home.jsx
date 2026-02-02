import React, { useContext } from 'react'
import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'
import Footer from '../../components/Footer'
import { ProductContext } from '../../context/ProductsContext';
import CollectionsComp from '../../components/CollectionsComp';



const Home = () => {


  const { fetchProducts, allProducts, setAllProducts } = useContext(ProductContext)

  const filtredProducts = allProducts.filter((item) => item.featured === true)

  return (
    <div>
      <Navbar />
      <Hero />
      <section id='Collection' className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-blue-900">
          Our Collection
        </h2>

        <CollectionsComp products={filtredProducts} />

      </section>
      <Footer />
    </div>
  )
}

export default Home
