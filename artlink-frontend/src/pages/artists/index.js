import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/tiny-slider.css';
import '../../css/swiper.min.css';;
import '../../css/style.min.css';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Artists from '@/components/Artists';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';

const ArtistsPage = () => {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/users')
        .then(res => res.json())
        .then(data => {
            if(data.users) {
                setArtists(data.users);
            }
        })
        .catch((err) => {
            console.error(err);
        });
    }, []);


    return(
        <>
        <Navbar />
        <main>
        <section className='creator section bg-light'>
            {/* Start container */}
            <div className='container'>
                <div className='row mt-4'>
                    <div className='col-lg-12'>
                        <nav aria-label='breadcrumb'>
                            <ol className='breadcrumb default mb-0'>
                                <li className='breadcrumb-item'><a href='/'>Home</a></li>
                                <li className='breadcrumb-item active text-primary' aria-current='page'>Artists</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className='row align-items-center justify-content-center'>
                    <div className='col-lg-8'>
                        <div className='inner-heading text-center'>
                            <div className='mt-4'>
                                <h1 className='fw-bold'>Popular Artists</h1>
                                <p className='text-muted'>Check out the hot names in the marketplace
                                <br />
                                What are you waiting for?
                                </p>
                            </div>
                        </div>

                        <div className='heading-bottom-icon d-flex justify-content-center text-center'>
                            <FilterVintageIcon />
                            <FilterVintageIcon />
                            <FilterVintageIcon />
                        </div>
                    </div>
                </div>

                <div className='popular-creator'>
                    <div className='row faq align-items-center mt-5'>
                        {artists.map((member, index) => (
                            <div key={index} className='col-lg-3 mt-4 mt-lg-0 pb-4'>
                                <a href={`/artists/${member.email}`}>
                                <div className='creator-box position-relative'>
                                    <div className='number position-absolute'>
                                        <h5 className='fw-bold'>{index + 1}.</h5>
                                    </div>
                                    <div className='creator-image text-center'>
                                        <img src={member.profileImg} alt='' className='img-fluid avatar-lg rounded-circle'></img>
                                    </div>
                                    <div className='creator-content text-center mt-3'>
                                        <h6 className='fw-bold'>{member.username}</h6>
                                        <p className='mb-0 text-muted fw-semibold'>{member.sales} Sales at {member.ethAmount} ETH</p>
                                    </div>
                                </div>
                                </a>
                            </div>
                        ))} 
                    </div>
                </div>



            </div>
        </section>
        </main>
        <Footer />
    </>
    )
}

export default ArtistsPage;