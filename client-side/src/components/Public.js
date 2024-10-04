import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">Auto. Repairs!</span></h1>
            </header>
            <main className="public__main">
                <p>Located in Beautiful Lahore City, Auto. Repairs  provides a trained staff ready to meet your tech repair needs.</p>
                <address className="public__addr">
                    Auto. Repairs<br />
                    Lahore Pakistan<br />
                    Lahore, LHR 54000<br />
                    <a href="tel:+923007315113">(+92) 300-7315-113</a>
                </address>
                <br />
                <p>Owner: Muhammad Afzal</p>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public
