const mongoose = require('mongoose');

const productSchema = mongoose.Schema({ // 상품 정보를 담은 스키마
  title: { type: String },
  lprice: { type: Number },
  image: { type: String },  // 이미지 경로 또는 URL 등
  quantity: { type: Number },  // 수량
});

const userSchema = mongoose.Schema({ // 사용자 정보를 담은 스키마
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId
  },
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  email: { type: String, required: true },
  products: [productSchema],  // 상품 정보를 담은 배열
});

module.exports = mongoose.model('User', userSchema);