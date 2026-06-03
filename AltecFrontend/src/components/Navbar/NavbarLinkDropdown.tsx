import { NavLink } from "react-router-dom"

type NavLinkDropdownProps = {
    link: {
        name: string,
        path: string,
        children:
            {
                name: string,
                path: string
            } []
    }
}

export default function NavLinkDropdown({ link }: NavLinkDropdownProps) {    

    return (
        <div className="group relative bg-altec-gray">
            <NavLink 
                className="nav-link"
                key={link.name}
                to={link.path}
            >
                {link.name}
            </NavLink>
            <div className="hidden group-hover:block absolute top-full pb-2 pl-2 bg-altec-gray min-w-3xs flex flex-col">
                {link.children.map(el => (
                        <NavLink 
                            className="nav-link block pt-2"
                            key={el.name} 
                            to={el.path}
                        >
                            {el.name}
                        </NavLink>
                ))}
             </div>
        </div>
    )
}
