import { DataTable } from "@/components/DataTable";
import OwnerWrapper from "@/components/OwnerWrapper";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { aestheticianColumn } from "@/lib/aesthetician-column";
import { Aesthetician, Availability, Experience, Sex } from "@/lib/types";

async function getData(): Promise<Aesthetician[]> {
  return [
    {
      firstName: "Sophia",
      lastName: "Martinez",
      middleInitial: "J",
      branchName: "Batangas City Branch",
      sex: Sex.Female,
      experience: Experience.Pro,
      averageRate: 4.9,
      availability: Availability.Available,
      phoneNumber: "09170010001",
      image: "/images/aestheticians/sophia-martinez.jpg",
    },
    {
      firstName: "Ethan",
      lastName: "Ramirez",
      middleInitial: "K",
      branchName: "Lipa City Branch",
      sex: Sex.Male,
      experience: Experience.Regular,
      averageRate: 4.5,
      availability: Availability.Working,
      phoneNumber: "09170010002",
      image: "/images/aestheticians/ethan-ramirez.jpg",
    },
    {
      firstName: "Camille",
      lastName: "Dela Rosa",
      middleInitial: "L",
      branchName: "Sto Tomas Batangas Branch",
      sex: Sex.Female,
      experience: Experience.Pro,
      averageRate: 4.8,
      availability: Availability.Break,
      phoneNumber: "09170010003",
      image: "/images/aestheticians/camille-dela-rosa.jpg",
    },
    {
      firstName: "Liam",
      lastName: "Mendoza",
      middleInitial: "A",
      branchName: "Lemery City Branch",
      sex: Sex.Male,
      experience: Experience.Regular,
      averageRate: 4.3,
      availability: Availability.OffDuty,
      phoneNumber: "09170010004",
      image: "/images/aestheticians/liam-mendoza.jpg",
    },
    {
      firstName: "Isabella",
      lastName: "Santiago",
      middleInitial: "M",
      branchName: "Batangas City Branch",
      sex: Sex.Female,
      experience: Experience.Pro,
      averageRate: 5.0,
      availability: Availability.Available,
      phoneNumber: "09170010005",
      image: "/images/aestheticians/isabella-santiago.jpg",
    },
    {
      firstName: "Noah",
      lastName: "Reyes",
      middleInitial: "P",
      branchName: "Lipa City Branch",
      sex: Sex.Male,
      experience: Experience.Regular,
      averageRate: 4.6,
      availability: Availability.Working,
      phoneNumber: "09170010006",
      image: "/images/aestheticians/noah-reyes.jpg",
    },
    {
      firstName: "Mia",
      lastName: "Villanueva",
      middleInitial: "R",
      branchName: "Sto Tomas Batangas Branch",
      sex: Sex.Female,
      experience: Experience.Pro,
      averageRate: 4.7,
      availability: Availability.Break,
      phoneNumber: "09170010007",
      image: "/images/aestheticians/mia-villanueva.jpg",
    },
    {
      firstName: "Gabriel",
      lastName: "Cruz",
      middleInitial: "S",
      branchName: "Lemery City Branch",
      sex: Sex.Male,
      experience: Experience.Pro,
      averageRate: 4.9,
      availability: Availability.Available,
      phoneNumber: "09170010008",
      image: "/images/aestheticians/gabriel-cruz.jpg",
    },
    {
      firstName: "Chloe",
      lastName: "Flores",
      middleInitial: "T",
      branchName: "Batangas City Branch",
      sex: Sex.Female,
      experience: Experience.Regular,
      averageRate: 4.4,
      availability: Availability.Working,
      phoneNumber: "09170010009",
      image: "/images/aestheticians/chloe-flores.jpg",
    },
    {
      firstName: "Lucas",
      lastName: "Navarro",
      middleInitial: "V",
      branchName: "Lipa City Branch",
      sex: Sex.Male,
      experience: Experience.Pro,
      averageRate: 4.8,
      availability: Availability.Available,
      phoneNumber: "09170010010",
      image: "/images/aestheticians/lucas-navarro.jpg",
    },
  ];
}

export default async function AestheticianPage() {
  const data = await getData();

  return (
    <OwnerWrapper title="Manage Aestheticians">
      <div className="">
        <DataTable columns={aestheticianColumn} data={data}>
          <SearchInput placeholder="Search by aesthetician name..." />
          <Button>New Aesthetician</Button>
        </DataTable>
      </div>
    </OwnerWrapper>
  );
}
