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
        <div className="group">
            <NavLink 
                key={link.name}
                to={link.path}
            >
                {link.name}
            </NavLink>
            {link.children.map(el => (
                <NavLink 
                    className="hidden group-hover:block"
                    key={el.name} 
                    to={el.path}
                >
                    {el.name}
                </NavLink>
            ))}
        </div>
    )
}
