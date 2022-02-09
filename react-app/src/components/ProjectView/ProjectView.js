import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProjects } from '../../store/projects';
import { getSteps } from '../../store/steps';
import { fetchUserData } from '../../store/session';
import './ProjectView.css';

const ProjectView = ({ project }) => {
    const { projectId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProjects());
        dispatch(getSteps({ projectId }));
    }, [dispatch, projectId]);

    const allProjects = useSelector(state => {
        return state.projects
    });
    const selectedProject = Object.values(allProjects).filter(project => project.id === parseInt(projectId));
    const allSteps = useSelector(state => {
        return Object.values(state.steps)
    });

    useEffect(() => {
        dispatch(fetchUserData({ userId: selectedProject[0]?.userId }))
    }, [dispatch, selectedProject[0]?.userId]);
    const author = useSelector(state => {
        return Object.values(state.session)[0]
    });

    return (
        <>
            {selectedProject.map(project => {
                const supplies = selectedProject[0].suppliesText;
                const suppliesRegex = / ?- /;
                const suppliesArr = supplies.split(suppliesRegex);
                return (
                    <div className='project-view' key={project.id}>
                        <div className='project-header'>
                            {project.title}
                        </div>
                        <div className='project-author'>
                            By {author?.username}
                        </div>
                        <img className='project-image' src={project.suppliesImage ? project.suppliesImage : '/images/noimage.png'} alt="Project overview" />
                        <div className='project-description'>
                            {project.description}
                        </div>
                        {project.suppliesText ?
                            <>
                                <div className='project-section-header'>
                                    Supplies
                                </div>
                                <ul className='project-supplies'>
                                    {suppliesArr.map(supply => {
                                        if (supply) {
                                            return (
                                                <li>{supply}</li>
                                            )
                                        }
                                    })}
                                </ul>
                            </>
                            : ''}
                        <div className='project-section-header'>
                            Steps
                        </div>
                        <ol className='project-steps'>
                            {allSteps.map(step => {
                                console.log(step);
                                return (
                                    <li>
                                        <h3>{step.title}</h3>
                                        {step.image ?
                                            <img src={step.image} key={step.id} /> :
                                            ''}
                                        {step.description}
                                    </li>
                                )
                            })}
                        </ol>
                    </div>
                )
            })}
        </>
    )
};

export default ProjectView;
