import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import http from "../http"
import { useDispatch, useSelector } from "react-redux";
import { clearStorage, fromStorage, isEmpty } from "../lib";
import { clearUser, setUser } from "../store";

export const NavBar = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Assuming tablets and phones have a maximum width of 768px
    const user = useSelector((st) => st.user.value);
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        http.get('https://mern-shop-ecommerce.onrender.com/category')
            .then(({data}) => setCategories(data))
            .catch(err => {})
    

        http.get('https://mern-shop-ecommerce.onrender.com/brand')
            .then(({data}) => setBrands(data))
            .catch(err => {})
    }, [])

    useEffect(() => {
        if (isEmpty(user)) {
          const token = fromStorage("user_token");
    
          if (!isEmpty(token)) {
            http
              .get("profile/details")
              .then(({ data }) => {
                dispatch(setUser(data));
              })
              .catch((err) => {
                clearStorage("user_token");
              });
          }
        }
      }, [user]);
    
      const handleLogout = (ev) => {
        ev.preventDefault();
    
        dispatch(clearUser());
        clearStorage("user_token");
      };

    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };
    
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);

    return <div className="row">
    <nav className="navbar navbar-expand-lg navbar-light bg-white col-12">
        <button className="navbar-toggler d-lg-none border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav mx-auto mt-2 mt-lg-0">
                <li className="nav-item active">
                    <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="categories" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Categories</a>
                    <div className="dropdown-menu" aria-labelledby="categories">
                       {categories.map(category => <Link key={category._id}
                       className="dropdown-item" to={`category/${category._id}`}>
                        {category.name}</Link>)}
                    </div>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="brands" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Brands</a>
                    <div className="dropdown-menu" aria-labelledby="brands">
                    {brands.map(brand => <Link key={brand._id}
                       className="dropdown-item" to={`brand/${brand._id}`}>
                        {brand.name}</Link>)}

                    </div>
                </li>
                {isMobile && (
            <>
              {isEmpty(user) ? (
                <>
                  <li className="nav-item active">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item active">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item active">
                    <Link className="nav-link" to="/profile">
                      <i className="fas fa-user-circle me-2"></i>
                      {user.name}
                    </Link>
                  </li>
                  <li className="nav-item active">
                    <Link className="nav-link" onClick={handleLogout}>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Logout
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
                
            </ul>
        </div>
    </nav>
</div>
}