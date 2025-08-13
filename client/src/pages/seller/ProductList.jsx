
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductList = () => {
  const { currency, products ,axios,fetchProducts} = useAppContext();

  const toggleStock=async(id,inStock)=>{
    try {
      const{data}=await axios.post('/api/product/stock',{id,inStock})
      if(data.success){
        fetchProducts();
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
       toast.error(error.message)
    }
  }

  return (
    <div className="w-full h-[95vh] overflow-y-scroll no-scrollbar">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>

        <div className="w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
          <table className="table-auto w-full text-sm text-left text-gray-500">
            <thead className="text-gray-900 bg-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold max-sm:hidden">Selling Price</th>
                <th className="px-4 py-3 font-semibold">In Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-300">
                  <td className="px-4 py-3 flex items-center space-x-3">
                    <div className="border border-gray-300 rounded overflow-hidden w-16 h-16">
                      <img
                        src={product.image[0]}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="truncate max-sm:hidden">{product.name}</span>
                  </td>
                  <td className="px-6 py-3">{product.category}</td>
                  <td className="px-9 py-3 max-sm:hidden">
                    {currency}
                    {product.offerPrice}
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                      <input onClick={()=>toggleStock(product._id, !product.inStock)} checked={product.inStock} type="checkbox" className="sr-only peer" />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
