import { DataTable } from "@/components/DataTable";
import OwnerWrapper from "@/components/OwnerWrapper";
import { serviceColumn } from "@/lib/service-column";
import { Service, ServiceCategory } from "@/lib/types";

async function getData(): Promise<Service[]> {
  return [
    {
      serviceName: "Ombre Brows",
      category: ServiceCategory.SemiPermanentMakeUp,
      averageRate: 4.8,
      branchName: "Ayala Branch",
      originalPrice: 8000,
      isSale: true,
      finalPrice: 6400,
      discountPercentage: 20,
      image: "/images/ombre-brows.jpg",
    },
    {
      serviceName: "Microblading",
      category: ServiceCategory.SemiPermanentMakeUp,
      averageRate: 4.6,
      branchName: "SM North Branch",
      originalPrice: 7500,
      isSale: false,
      finalPrice: 7500,
      discountPercentage: 0,
      image: "/images/microblading.jpg",
    },
    {
      serviceName: "Diamond Peel",
      category: ServiceCategory.FacialAndLaserTreatments,
      averageRate: 4.7,
      branchName: "BGC Branch",
      originalPrice: 1500,
      isSale: true,
      finalPrice: 1200,
      discountPercentage: 20,
      image: "/images/diamond-peel.jpg",
    },
    {
      serviceName: "HydraFacial",
      category: ServiceCategory.FacialAndLaserTreatments,
      averageRate: 4.9,
      branchName: "Ayala Branch",
      originalPrice: 3500,
      isSale: true,
      finalPrice: 2800,
      discountPercentage: 20,
      image: "/images/hydrafacial.jpg",
    },
    {
      serviceName: "Underarm Waxing",
      category: ServiceCategory.WaxingServices,
      averageRate: 4.5,
      branchName: "SM North Branch",
      originalPrice: 500,
      isSale: false,
      finalPrice: 500,
      discountPercentage: 0,
      image: "/images/underarm-wax.jpg",
    },
    {
      serviceName: "Brazilian Waxing",
      category: ServiceCategory.WaxingServices,
      averageRate: 4.7,
      branchName: "BGC Branch",
      originalPrice: 1500,
      isSale: true,
      finalPrice: 1200,
      discountPercentage: 20,
      image: "/images/brazilian-wax.jpg",
    },
    {
      serviceName: "Full Leg Diode Laser",
      category: ServiceCategory.DiodeLaserHairRemoval,
      averageRate: 4.8,
      branchName: "Ayala Branch",
      originalPrice: 6000,
      isSale: true,
      finalPrice: 4800,
      discountPercentage: 20,
      image: "/images/full-leg-diode.jpg",
    },
    {
      serviceName: "Upper Lip Diode Laser",
      category: ServiceCategory.DiodeLaserHairRemoval,
      averageRate: 4.6,
      branchName: "SM North Branch",
      originalPrice: 2000,
      isSale: false,
      finalPrice: 2000,
      discountPercentage: 0,
      image: "/images/upper-lip-diode.jpg",
    },
    {
      serviceName: "Eyelash Extensions",
      category: ServiceCategory.Others,
      averageRate: 4.7,
      branchName: "BGC Branch",
      originalPrice: 2500,
      isSale: true,
      finalPrice: 2000,
      discountPercentage: 20,
      image: "/images/eyelash-extensions.jpg",
    },
    {
      serviceName: "Teeth Whitening",
      category: ServiceCategory.Others,
      averageRate: 4.5,
      branchName: "Ayala Branch",
      originalPrice: 5000,
      isSale: false,
      finalPrice: 5000,
      discountPercentage: 0,
      image: "/images/teeth-whitening.jpg",
    },
  ];
}

export default async function ServicePage() {
  const data = await getData();
  return (
    <OwnerWrapper title="Manage Services">
      <div className="">
        <DataTable
          buttonLabel="Add Service"
          searchPlaceholder="Search by service name..."
          columns={serviceColumn}
          data={data}
        />
      </div>
    </OwnerWrapper>
  );
}
