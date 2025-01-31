import { useEffect, useState } from 'react';
import './MyProfileView.css';
import { Sex } from '../../enums/sex';
import { IInterestResponse } from '../../models/IInterestResponse';
import socialMediaApiService from '../../services/social-media-api-service';  /* Singleton */
import SubMenu from '../../components/sub-menu/SubMenu';
import PersonalInfoModal from '../../components/personal-info-modal/PersonalInfoModal';
import { IUpdatePersonalInfoRequest } from '../../models/IUpdatePersonalInfoRequest';

const MyProfileView = () => {

	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [personalInfo, setPersonalInfo] = useState<string | null>(null);
	const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
	const [age, setAge] = useState<number>(0);
	const [sex, setSex] = useState<Sex>(Sex.Male);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [interests, setInterests] = useState<IInterestResponse[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);


	useEffect(() => {
		let isMounted = true;

		const fetchProfile = async () => {
			try {
				const profileData = await socialMediaApiService.getMyselfAsync();
				if (isMounted) {
					setFirstName(profileData.firstName);
					setLastName(profileData.lastName);
					setEmail(profileData.email);
					setPersonalInfo(profileData.personalInfo);
					setDateOfBirth(profileData.dateOfBirth);
					setAge(profileData.age);
					setSex(profileData.sex === 0 ? Sex.Male : Sex.Female);
					setInterests(profileData.interests);
				}
			} catch (error: any) {
				if (isMounted) {
					setErrorMessage(error.message || "An unknown error occurred.");
				}
			}
		};

		fetchProfile();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleEditPersonalInfo = () => {
		setIsModalOpen(true);
	};

	const handleSavePersonalInfo = async (text: string) => {
		const updatedPersonalInfo = text.trim() === "" ? null : text;
		const request: IUpdatePersonalInfoRequest = {
			personalInfo: updatedPersonalInfo
		};
		try {
			socialMediaApiService.updatePersonalInfoAsync(request);
			setPersonalInfo(updatedPersonalInfo);
		} catch (error) {
			console.error("Error saving personal info", error);
		} finally {
			setIsModalOpen(false);
		}
	};

	return (
		<>
			<h1>MIN PROFIL</h1>
			{errorMessage && <p className="error-message">{errorMessage}</p>}
			<SubMenu items={[{ label: "Skriv om dig själv", onClick: handleEditPersonalInfo }]} />

			<p>{firstName} {lastName}, ({sex === Sex.Male ? "Man" : "Kvinna"})</p>
			<p>Email:</p>
			<p>{email}</p>
			<p>Födelsedatum:</p>
			<p>{new Date(dateOfBirth).toLocaleDateString("sv-SE")}, ({age}) år</p>
			<p>Mina intressen:</p>
			{interests.length === 0 ? (
				<p>Inga intressen tillagda än.</p>
			) : (
				<p>
					{interests.map((interest) => (
						<span key={interest.id}>{interest.name} </span>
					))}
				</p>
			)}
			<p>Om mig:</p>
			{personalInfo === null ? (
				<p>Inget skrivet än. Gör gärna det om du vill berätta mer om dig själv. Endast dina vänner kan se vad som står här.</p>
			) : (
				<p>{personalInfo}</p>
			)}

			<PersonalInfoModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSaveOrSend={handleSavePersonalInfo}
				initialValue={personalInfo || ""}
			/>
		</>
	);
};

export default MyProfileView;