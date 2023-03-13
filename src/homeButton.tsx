import { useNavigate } from 'react-router-dom';

function HomeButton(){
    const navigate = useNavigate();
    const navigateToPage = () => {  
        navigate({
        pathname: "/"
        });
    };;
    return(
        <button onClick={() => navigateToPage()}>
            Home
        </button>
    )
}

export default HomeButton;