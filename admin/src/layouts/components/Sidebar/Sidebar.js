import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import './Sidebar.css';
import config from '~/configs';
import { closeSidebar, openSidebar } from '~/redux/reducer/module';

const { home } = config.routes;

function Sidebar() {
    const [openIndex, setOpenIndex] = useState(-1);
    const { sidebar } = useSelector((state) => state.module);

    const dispatch = useDispatch();

    const handleClose = () => {
        if (isMobile) {
            dispatch(closeSidebar());
            setOpenIndex(-1);
            document.body.classList.remove('open');
        }
    };

    const handleOpen = () => {
        if (!isMobile) {
            dispatch(openSidebar());
        }
    };

    return (
        <div className={`sidebar ${sidebar || !isMobile ? 'active' : ''}`}>
            <Link to={home} className="sidebar-logo">
                <div className="logo"></div>
            </Link>

            <div className="sidebar-content">
                <div className="sidebar-over">
                    <ul className="sidebar-list">
                        {config.sidebar.map((sidebar, index) => (
                            <li key={index}>
                                {sidebar.sub ? (
                                    <div
                                        className={`sidebar-link ${openIndex === index && 'active'}`}
                                        onClick={() => {
                                            setOpenIndex(openIndex === index ? -1 : index);
                                            handleOpen();
                                        }}
                                    >
                                        <FontAwesomeIcon icon={sidebar.icon} className="sidebar-icon" />
                                        <span>
                                            {sidebar.title}

                                            <FontAwesomeIcon icon={faChevronLeft} />
                                        </span>
                                    </div>
                                ) : (
                                    <Link
                                        className="sidebar-link"
                                        onClick={() => {
                                            setOpenIndex(openIndex === index ? -1 : index);
                                            handleClose();
                                        }}
                                        to={sidebar.path}
                                    >
                                        <FontAwesomeIcon icon={sidebar.icon} className="sidebar-icon" />
                                        <span>{sidebar.title}</span>
                                    </Link>
                                )}
                                {sidebar.sub && (
                                    <Collapse in={openIndex === index}>
                                        <ul>
                                            {sidebar.sub.map((child, index) => (
                                                <li key={index} onClick={handleClose}>
                                                    <Link className="link-sub" to={child.path}>
                                                        <FontAwesomeIcon icon={faChevronRight} />
                                                        <span>{child.title}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </Collapse>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
