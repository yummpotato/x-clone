import { Outlet } from "react-router-dom";

export default function Layout() {
    return(
        <>
            <Outlet/> 
        </>
    );
}

{/* <Outlet/>: Home components가 렌더링 되었음 */}