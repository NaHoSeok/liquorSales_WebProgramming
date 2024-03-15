const User = require('./user.model');
// 사용자 생성
const createUser = async (req, res) => {
  try {
    const { name, id, password, phoneNumber, email } = req.body;

    // 사용자 생성
    const user = new User({
      name,
      id,
      password,
      phoneNumber,
      email,
    });

    // 사용자 저장
    await user.save();

    // 응답
    res.status(201).json({ message: '회원가입 성공!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
};



// 사용자 조회
const getUserById = async (req, res) => {
  try {
    // Passport의 isAuthenticated() 함수를 사용하여 로그인 상태 확인

    // 로그인 여부 확인
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const userId = req.user._id;

    // 사용자 조회
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ name: user.name});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 사용자 업데이트
const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const updatedUserData = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 사용자 삭제
const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 상품 추가
const addToCart = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const userId = req.user._id;

      // 클라이언트에서 전달한 상품 데이터
      const productData = req.body.products;

      // 사용자 조회
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      // 클라이언트에서 전달한 상품을 사용자의 장바구니에 추가
      const { title, lprice, image, quantity } = productData;
      const newProduct = { title, lprice, image, quantity };
      user.products.push(newProduct);

      // 사용자 DB에 저장
      await user.save();

      res.status(200).json({ message: '상품이 장바구니에 추가되었습니다.', user });
    } else {
      // 사용자가 로그인하지 않은 경우 처리
      res.status(401).json({ message: '로그인이 필요합니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 상품 조회
const getProducts = async (req, res) => {
  try {
    // 로그인 여부 확인
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    // 현재 로그인한 사용자의 ID
    const userId = req.user._id;

    // 사용자 조회
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 사용자의 상품 목록 응답
    res.status(200).json({ products: user.products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 상품 삭제
const deleteProduct = async (req, res) => {
  try {
    // 로그인 여부 확인
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    const userId = req.user._id;
    const productId = req.body.productId; // 클라이언트에서 productId를 body로 전송하도록 변경

    // 사용자 조회
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 상품 삭제
    user.products = user.products.filter(product => product._id.toString() !== productId);

    // 사용자 DB에 저장
    await user.save();

    res.status(200).json({ message: '상품이 삭제되었습니다.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 상품 수량 변경
const updateProductQuantity = async (req, res) => {
  try {
    // 로그인 여부 확인
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    const userId = req.user._id;
    const productId = req.body.productId; // 클라이언트에서 productId를 body로 전송하도록 변경
    const quantity = req.body.quantity; // 클라이언트에서 quantity를 body로 전송하도록 변경

    // 사용자 조회
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 상품 수량 변경
    user.products = user.products.map(product => {
      if (product._id.toString() === productId) {
        product.quantity = quantity;
      }
      return product;
    });

    // 사용자 DB에 저장
    await user.save();

    res.status(200).json({ message: '상품 수량이 변경되었습니다.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
};


module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addToCart,
  getProducts,
  deleteProduct,
  updateProductQuantity,
};