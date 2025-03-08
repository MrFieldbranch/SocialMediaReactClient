export interface NavLink {
	path: string;
	label: string;
}

export const navLinks: NavLink[] = [
  { path: "/myprofile", label: "Min profil" },
  { path: "/myfriends", label: "Mina vänner" },
  { path: "/strangers", label: "Möjliga vänner" },
  { path: "/friendrequests", label: "Aktuella vänförfrågningar" },
  { path: "/interests", label: "Intressen" },
  { path: "/publicboard", label: "Anslagstavlan" },
];