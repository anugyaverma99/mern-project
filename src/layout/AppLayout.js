
import Footer from "./Footer";
import Header from "./Header";
function AppLayout({children}){
    return(
        <>
       <Header/>
       <br />
       {children}
       <br/>
       <br/>
       <Footer/>
       </>
      
       

    );
}
export default AppLayout;