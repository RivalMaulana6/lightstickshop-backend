import mongoose from 'mongoose';

// Definisi skema untuk koleksi 'products' dengan validasi
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama produk harus diisi'],
    trim: true,
    minlength: [3, 'Nama produk harus memiliki setidaknya 3 karakter'],
    maxlength: [100, 'Nama produk tidak boleh melebihi 100 karakter']
  },
  price: {
    type: Number,
    required: [true, 'Harga produk harus diisi'],
    min: [0, 'Harga produk tidak boleh kurang dari 0']
  },
  stock: {
    type: Number,
    required: [true, 'Stok produk harus diisi'],
    min: [0, 'Stok produk tidak boleh kurang dari 0']
  },
  image: {
    type: String,
    required: [true, 'URL gambar produk harus diisi'],
    validate: {
      validator: function(v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: props => `${props.value} bukan URL yang valid`
    }
  }
});

// Pembuatan model 'Product' berdasarkan skema 'productSchema'
const Product = mongoose.model('Product', productSchema);

export default Product;
