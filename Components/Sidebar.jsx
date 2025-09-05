import React from "react"
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Sidebar() {
    const MenuList = [
        {
          title:"Home",
          icon: <i className="fa fa-home" style={iconStyle}></i>
        },
        {
          title:"Contact",
          icon: <i className="fa fa-envelope" style={iconStyle}></i>
        },
        {
          title:"AboutUs",
          icon: <i className="fa fa-info-circle" style={iconStyle}></i>
        },
        {
          title:"Settings",
          icon: <i className="fa fa-cog" style={iconStyle}></i>
        }
      ]
    return (
        <aside>
            <nav>
                <ul>
                    {MenuList.map((item, index) => (
                        <li key={index}>
                            {item.icon} {item.title}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );

}

const iconStyle = {
    marginRight: '0.5rem',
  };