import {loginSuccess} from "../redux/actions/actions";
import {connect} from "react-redux";

function Home({user}) {
    console.log(user)
    return (
        <>
            <div className="container mt-5">
                <h1>Home</h1>
                <h1></h1>
                <h3>{user.jwtToken}</h3>
                <h2>{user.name}</h2>
            </div>
        </>
    )
}


const mapStateToProps = (state) => ({
    user: state.user
})

const mapDispatchToProps = {
    loginSuccess
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);