import { Link } from "react-router-dom"

function NavBar() {
  
    return (

        <div className=" flex gap-4">
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
            <Link to='/contact'>Contact</Link>
            <Link to='/playground'>Test</Link>
        </div>
    
  )
}

export default NavBar