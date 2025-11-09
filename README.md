# 🛍️ Zugo E-Commerce Frontend

A modern, premium e-commerce frontend built with React, featuring stunning animations and a beautiful user experience.

## ✨ Features

- 🎨 **Beautiful UI/UX** - Modern gradient designs with smooth animations
- 🔐 **Authentication** - Secure login/signup with JWT tokens
- 🛒 **Shopping Cart** - Real-time cart management
- 💳 **Checkout** - Seamless checkout process with multiple payment options
- 📦 **Order Tracking** - Complete order history and tracking
- 👨‍💼 **Admin Dashboard** - Full product management system
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development

## 🚀 Tech Stack

- **React 18** - Modern React with Hooks
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Beautiful notifications
- **React Icons** - Icon library

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ecommerce-zugo-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
Update the API base URL in `src/config/api.js`:
```javascript
export const API_BASE_URL = 'https://ecommerce-zugo-backend.onrender.com'; // Your backend URL
```

4. **Run the development server**
```bash
npm run dev
```

The app will be available at `https://ecommerce-zugo-frontend.vercel.app/`

## 🏗️ Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Loader.jsx
│   │   └── Modal.jsx
│   ├── layout/          # Layout components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── auth/            # Authentication pages
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── admin/           # Admin pages
│   │   ├── AdminDashboard.jsx
│   │   ├── ProductManagement.jsx
│   │   └── ProductForm.jsx
│   ├── Home.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   └── Orders.jsx
├── store/               # Zustand state management
│   ├── authStore.js
│   ├── cartStore.js
│   ├── productStore.js
│   └── orderStore.js
├── services/            # API services
│   ├── api.js
│   ├── authService.js
│   ├── cartService.js
│   ├── productService.js
│   └── orderService.js
├── config/              # Configuration
│   └── api.js
├── App.jsx
└── main.jsx
```

## 🎯 Key Features

### User Features
- Browse products with search functionality
- View detailed product information
- Add products to cart with quantity selection
- Secure checkout with multiple payment options
- Track order history
- Responsive design for mobile and desktop

### Admin Features
- Dashboard with analytics
- Complete product management (CRUD operations)
- Product image URL support
- Real-time updates



## 🎨 Customization

### Theme Colors
Update colors in `tailwind.config.js`:
```javascript
colors: {
  primary: { ... },
  secondary: { ... }
}
```

### API Configuration
Update API endpoints in `src/config/api.js`

## 🤝 Backend Integration

This frontend is designed to work with the Zugo E-Commerce Backend API. Make sure the backend is running on the configured API base URL.

### API Endpoints Used:
- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Products**: `/api/products`, `/api/products/:id`
- **Cart**: `/api/cart`, `/api/cart/add`, `/api/cart/remove`
- **Orders**: `/api/orders/checkout`, `/api/orders`

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token is stored in localStorage
3. Token is automatically attached to all API requests
4. Protected routes check authentication status
5. Admin routes check user role

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## ⚡ Performance

- Code splitting with React.lazy (can be added)
- Optimized images
- Minimal bundle size
- Fast page transitions
- Efficient state management

## 🐛 Troubleshooting

### Cart not updating
- Ensure backend is running
- Check authentication token
- Verify API endpoints

### Images not loading
- Check image URLs are valid
- Verify CORS settings on backend
- Check network requests in DevTools

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 👨‍💻 Author

Built with ❤️ for the Zugo E-Commerce platform

## 🙏 Acknowledgments

- React Team
- Tailwind CSS Team
- Framer Motion
- All open-source contributors

---

**Happy Shopping! 🎉**

