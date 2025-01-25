import { useEffect, useState } from 'react';
import './StrangersView.css';
import { IBasicUserResponse } from '../../models/IBasicUserResponse';
import socialMediaApiService from '../../services/social-media-api-service';    /* Singleton */
import BasicUser from '../../components/basic-user/BasicUser';
import SubMenu from '../../components/sub-menu/SubMenu';

const StrangersView = () => {
	const [strangers, setStrangers] = useState<IBasicUserResponse[]>([]);
	const [errorMessage, setErrorMessage] = useState<string>("");

	useEffect(() => {
		let isMounted = true;

		const fetchStrangers = async () => {
			try {
				const strangersFromApi = await socialMediaApiService.getStrangersAsync();
				if (isMounted) {
					setStrangers(strangersFromApi);
				}
			} catch (error: any) {
				if (isMounted) {
					setErrorMessage(error.message || "An unknown error occurred.");
				}
			}
		};

		fetchStrangers();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<>
			<h1>MÖJLIGA VÄNNER</h1>
			{errorMessage && <p className="error-message">{errorMessage}</p>}
			<SubMenu items={[{ label: "Visa en lista där era gemensamma intressen beaktas", linkTo: '/strangers/sorted' }]} />
			{strangers.length === 0 ? (
				<p>Det finns inga användare i communityn som inte redan är i din vänlista, eller som inte redan ingår i en vänförfrågan.</p>
			) : (
				strangers.map((stranger) => (
					<BasicUser 
						key={stranger.id} 
						id={stranger.id} 
						firstName={stranger.firstName} 
						lastName={stranger.lastName} 
					/>
				))
			)}
		</>
	);
};

export default StrangersView;