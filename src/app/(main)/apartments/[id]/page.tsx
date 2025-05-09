"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import MobileApartmentDetail from "@/components/apartment-detail/mobile-apartment-detail";
import DesktopApartmentDetail from "@/components/apartment-detail/desktop-apartment-detail";

export default function ApartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const apartmentId = Number(params.apartmentId);
  
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  // Fetch apartment data
  useEffect(() => {
    const fetchApartmentData = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/apartments/${apartmentId}`);
        // const data = await response.json();
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data based on your API structure
        const mockApartment = {
          id: apartmentId,
          role: "OWNER",
          title: "1-комнатная квартира · 44 м² · 3/21 этаж, мкр Тастак-2, Варламова 33",
          selectedGender: "ANY",
          doYouLiveInThisHouse: true,
          howManyPeopleLiveInThisApartment: "1",
          numberOfPeopleAreYouAccommodating: 3,
          minAge: 18,
          maxAge: 35,
          regionText: "Алматы",
          districtText: "Алмалинский р-н",
          microDistrictText: "мкр Тастак-2",
          address: "Варламова 33",
          arriveDate: "2025-05-01",
          cost: 45000,
          quantityOfRooms: "1",
          isDepositRequired: true,
          deposit: 45000,
          arePetsAllowed: false,
          isCommunalServiceIncluded: false,
          minAmountOfCommunalService: 15000,
          maxAmountOfCommunalService: 25000,
          intendedForStudents: true,
          areBadHabitsAllowed: false,
          apartmentsInfo: "Пластиковые окна, новая сантехника, тихий двор, кондиционер. Квартира находится в новом жилом комплексе с хорошей инфраструктурой. Рядом есть магазины, кафе, парк и остановки общественного транспорта. Квартира полностью меблирована, есть вся необходимая бытовая техника.",
          typeOfHousing: "APARTMENT",
          numberOfFloor: 3,
          maxFloorInTheBuilding: 21,
          areaOfTheApartment: 44,
          forALongTime: true,
          preferences: [
            "Без вредных привычек", 
            "Тишина после 22:00", 
            "Уборка по расписанию", 
            "Интернет включен",
            "Кондиционер"
          ],
          coordsX: "43.2584",
          coordsY: "76.9274",
          photos: [
            { id: 3, url: "https://i.pinimg.com/originals/d4/7b/e2/d47be28251f9931b33fb37816bc32143.png" },
            { id: 2, url: "https://i.pinimg.com/originals/0c/71/07/0c7107b8ee09b17f87de5cfd883932f9.jpg" },
            { id: 1, url: "https://findroommate.s3.eu-north-1.amazonaws.com/1743106179200_1.avif" },
            { id: 4, url: "https://i.pinimg.com/originals/2d/81/d5/2d81d5b0ab403c8f0933fcc37e77c94e.jpg" },
            { id: 5, url: "https://i.pinimg.com/originals/3a/2b/e6/3a2be6f7ca58396c413caad5eda6b1df.jpg" }
          ],
          user: {
            firstName: "Александр",
            lastName: "Петров",
            profilePhoto: "https://i.pravatar.cc/300?img=8"
          },
          consideringOnlyNPeople: false,
          ownersName: "Александр Петров",
          ownersPhoneNumbers: ["+7 708 123 4567"],
          residentsDataResponse: [
            {
              id: 201,
              name: "Марат Касымов",
              profilePhoto: "https://i.pravatar.cc/300?img=3",
              residentType: "RESIDENT"
            },
            {
              id: 202,
              name: "Даулетханов Дастан",
              profilePhoto: "https://i.pravatar.cc/300?img=18",
              residentType: "RESIDENT"
            }
          ],
          groupDataResponse: [
            {
              id: 102,
              freeSlots: 3,
              group: "Молодые специалисты",
              groupMembers: [
                {
                  id: 202,
                  name: "Марат Касымов",
                  age: 27,
                  phoneNumbers: ["+7 701 456 7890"],
                  appliedDate: "2025-01-20",
                  profilePhoto: "https://i.pravatar.cc/300?img=3",
                  permissionStatus: "APPROVED",
                  coverLetter: null,
                  me: null
                },
                {
                  id: 203,
                  name: "Даулетханов Дастан",
                  age: 24,
                  phoneNumbers: ["+7 700 765 4321"],
                  appliedDate: "2025-01-21",
                  profilePhoto: "https://i.pravatar.cc/300?img=18",
                  permissionStatus: "APPROVED",
                  coverLetter: null,
                  me: null
                }
              ]
            },
            {
              id: 101,
              freeSlots: 2,
              group: "Студенты",
              groupMembers: [
                {
                  id: 201,
                  name: "Рахматулла Думан",
                  age: 23,
                  phoneNumbers: ["+7 777 111 2233"],
                  appliedDate: "2025-01-15",
                  profilePhoto: "https://i.pravatar.cc/300?img=12",
                  permissionStatus: "APPROVED",
                  coverLetter: null,
                  me: null
                }
              ]
            },
          ]
        };
        
        setApartment(mockApartment as any);
      } catch (err: any) {
        console.error('Error fetching apartment data:', err);
        // setError("Не удалось загрузить данные объявления. Пожалуйста, попробуйте снова позже.");
      } finally {
        setLoading(false);
      }
    };

    if (apartmentId) {
      fetchApartmentData();
    }
  }, [apartmentId]);

  // // Loading state
  // if (loading) {
  //   return <ApartmentSkeleton />;
  // }

  // // Error state
  // if (error || !apartment) {
  //   return <ApartmentError error={error} onRetry={() => router.push('/apartments')} />;
  // }

  // Render based on screen size
  return isMobile ? (
    <MobileApartmentDetail apartment={apartment} />
  ) : (
    <DesktopApartmentDetail apartment={apartment} />
  );
}