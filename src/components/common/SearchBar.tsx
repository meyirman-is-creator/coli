"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import styles from "./SearchBar.module.scss";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux-hooks";
import {
  initialState,
  setGender,
  setPriceRange,
  setRoommates,
  setAddress,
} from "@/store/features/searchBar/searchBar";
import {
  fetchCities,
  fetchDistricts,
  fetchMicroDistricts,
  setSelectedRegion,
  setSelectedDistrict,
  setSelectedMicroDistrict,
} from "@/store/slices/addressSlice";
import { AddressType, genderOptions, roommateOptions } from "@/types/common";
import { formatPrice } from "@/utils/helpers";

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import icons
import {
  MapPin,
  DollarSign,
  User,
  Users,
  Search,
  ChevronDown,
} from "lucide-react";

const SearchBar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isSmallMobile = useMediaQuery({ maxWidth: 480 });

  const searchBarState = useAppSelector((state) => state.searchBar);
  const addressState = useAppSelector((state) => state.address);
  const { gender, priceRange, roommates, address } = searchBarState;
  const { cities, districts, microDistricts, status } = addressState;

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [mobileRegion, setMobileRegion] = useState<AddressType | null>(null);
  const [mobileDistrict, setMobileDistrict] = useState<AddressType | null>(
    null
  );
  const [mobileMicroDistrict, setMobileMicroDistrict] =
    useState<AddressType | null>(null);

  // Fetch cities on component mount
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  const getAddressDisplay = () => {
    if (address.microDistrictName) return address.microDistrictName;
    if (address.districtName) return address.districtName;
    return address.regionName || "Весь Казахстан";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams: Record<string, string> = {};

    if (address.regionId && address.regionId > 0) {
      queryParams.region = address.regionId.toString();
    }
    if (address.districtId && address.districtId > 0) {
      queryParams.district = address.districtId.toString();
    }
    if (address.microDistrictId && address.microDistrictId > 0) {
      queryParams.microDistrict = address.microDistrictId.toString();
    }

    queryParams.minPrice = priceRange[0].toString();
    queryParams.maxPrice = priceRange[1].toString();

    // gender => selectedGender
    if (gender) {
      queryParams.selectedGender = gender.code;
    }

    // numberOfPeopleAreYouAccommodating
    if (roommates) {
      queryParams.numberOfPeopleAreYouAccommodating = roommates.id.toString();
    }

    // Filter out empty keys
    const queryString = new URLSearchParams(queryParams).toString();

    // Navigate to /apartments?...
    router.push(`/apartments?${queryString}`);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleCitySelect = (city: AddressType) => {
    setMobileRegion(null);
    setMobileDistrict(null);
    setMobileMicroDistrict(null);

    dispatch(setSelectedRegion(city));
    dispatch(
      setAddress({
        ...address,
        regionId: city.id,
        regionName: city.namerus,
        districtId: null,
        districtName: "",
        microDistrictId: null,
        microDistrictName: "",
      })
    );

    if (city.haschild) {
      dispatch(fetchDistricts(city.id));
    }
  };

  const handleDistrictSelect = (district: AddressType) => {
    setMobileDistrict(null);
    setMobileMicroDistrict(null);

    dispatch(setSelectedDistrict(district));
    dispatch(
      setAddress({
        ...address,
        districtId: district.id,
        districtName: district.namerus,
        microDistrictId: null,
        microDistrictName: "",
      })
    );

    if (district.haschild) {
      dispatch(fetchMicroDistricts(district.id));
    }
  };

  const handleMicroDistrictSelect = (microDistrict: AddressType) => {
    setMobileMicroDistrict(null);
    dispatch(setSelectedMicroDistrict(microDistrict));
    dispatch(
      setAddress({
        ...address,
        microDistrictId: microDistrict.id,
        microDistrictName: microDistrict.namerus,
      })
    );
  };

  const handleSelectAllKazakhstan = () => {
    dispatch(setSelectedRegion(null));
    dispatch(setAddress(initialState.address));
  };

  function handleMobileRegionChange(value: string) {
    const nextRegion = cities.find((r) => r.id.toString() === value) || null;
    setMobileRegion(nextRegion);
    setMobileDistrict(null);
    setMobileMicroDistrict(null);

    if (nextRegion) {
      dispatch(setSelectedRegion(nextRegion));
      dispatch(
        setAddress({
          ...address,
          regionId: nextRegion.id,
          regionName: nextRegion.namerus,
          districtId: null,
          districtName: "",
          microDistrictId: null,
          microDistrictName: "",
        })
      );

      if (nextRegion.haschild) {
        dispatch(fetchDistricts(nextRegion.id));
      }
    } else {
      dispatch(setSelectedRegion(null));
      dispatch(setAddress(initialState.address));
    }
  }

  function handleMobileDistrictChange(value: string) {
    const nextDist = districts.find((d) => d.id.toString() === value) || null;
    setMobileDistrict(nextDist);
    setMobileMicroDistrict(null);

    if (nextDist) {
      dispatch(setSelectedDistrict(nextDist));
      dispatch(
        setAddress({
          ...address,
          districtId: nextDist.id,
          districtName: nextDist.namerus,
          microDistrictId: null,
          microDistrictName: "",
        })
      );

      if (nextDist.haschild) {
        dispatch(fetchMicroDistricts(nextDist.id));
      }
    } else {
      dispatch(setSelectedDistrict(null));
      dispatch(
        setAddress({
          ...address,
          districtId: null,
          districtName: "",
          microDistrictId: null,
          microDistrictName: "",
        })
      );
    }
  }

  function handleMobileMicroDistrictChange(value: string) {
    const nextMicro =
      microDistricts.find((m) => m.id.toString() === value) || null;
    setMobileMicroDistrict(nextMicro);

    if (nextMicro) {
      dispatch(setSelectedMicroDistrict(nextMicro));
      dispatch(
        setAddress({
          ...address,
          microDistrictId: nextMicro.id,
          microDistrictName: nextMicro.namerus,
        })
      );
    } else {
      dispatch(setSelectedMicroDistrict(null));
      dispatch(
        setAddress({
          ...address,
          microDistrictId: null,
          microDistrictName: "",
        })
      );
    }
  }

  function renderAddressDropdown() {
    if (!isMobile) {
      return (
        <div className={styles.addressDropdown}>
          <div className={styles.addressColumns}>
            <div className={styles.addressColumn}>
              <ul>
                <Button
                  variant="ghost"
                  className={`${styles.addressColumnItem} ${
                    address.regionName === "Весь Казахстан"
                      ? styles.activeItem
                      : ""
                  }`}
                  onClick={handleSelectAllKazakhstan}
                >
                  Весь Казахстан
                </Button>
                {cities.map((city) => (
                  <Button
                    key={city.id}
                    variant="ghost"
                    className={`${styles.addressColumnItem} ${
                      address.regionId === city.id ? styles.activeItem : ""
                    }`}
                    onClick={() => handleCitySelect(city)}
                  >
                    {city.namerus}
                  </Button>
                ))}
              </ul>
            </div>

            {districts.length > 0 && (
              <div className={styles.addressColumn}>
                <ul>
                  <Button
                    variant="ghost"
                    className={`${styles.addressColumnItem} ${
                      !address.districtId ? styles.activeItem : ""
                    }`}
                    onClick={() => {
                      dispatch(setSelectedDistrict(null));
                      dispatch(
                        setAddress({
                          ...address,
                          districtId: null,
                          districtName: "",
                          microDistrictId: null,
                          microDistrictName: "",
                        })
                      );
                    }}
                  >
                    Все районы
                  </Button>
                  {districts.map((dist) => (
                    <Button
                      key={dist.id}
                      variant="ghost"
                      className={`${styles.addressColumnItem} ${
                        address.districtId === dist.id ? styles.activeItem : ""
                      }`}
                      onClick={() => handleDistrictSelect(dist)}
                    >
                      {dist.namerus}
                    </Button>
                  ))}
                </ul>
              </div>
            )}

            {microDistricts.length > 0 && (
              <div className={styles.addressColumn}>
                <ul>
                  <Button
                    variant="ghost"
                    className={`${styles.addressColumnItem} ${
                      !address.microDistrictId ? styles.activeItem : ""
                    }`}
                    onClick={() => {
                      dispatch(setSelectedMicroDistrict(null));
                      dispatch(
                        setAddress({
                          ...address,
                          microDistrictId: null,
                          microDistrictName: "",
                        })
                      );
                    }}
                  >
                    Все микрорайоны
                  </Button>
                  {microDistricts.map((micro) => (
                    <Button
                      key={micro.id}
                      variant="ghost"
                      className={`${styles.addressColumnItem} ${
                        address.microDistrictId === micro.id
                          ? styles.activeItem
                          : ""
                      }`}
                      onClick={() => handleMicroDistrictSelect(micro)}
                    >
                      {micro.namerus}
                    </Button>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Button
            className={styles.confirmButton}
            onClick={() => setOpenDropdown(null)}
          >
            Выбрать
          </Button>
        </div>
      );
    } else {
      return (
        <div className={styles.mobileAddressDropdown}>
          <div className={styles.mobileAddressContainer}>
            <div className={styles.section}>
              <Select
                value={mobileRegion?.id ? mobileRegion.id.toString() : ""}
                onValueChange={handleMobileRegionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      {r.namerus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {districts.length > 0 && (
              <div className={styles.section}>
                <Select
                  value={mobileDistrict?.id ? mobileDistrict.id.toString() : ""}
                  onValueChange={handleMobileDistrictChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите район" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((dist) => (
                      <SelectItem key={dist.id} value={dist.id.toString()}>
                        {dist.namerus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {microDistricts.length > 0 && (
              <div className={styles.section}>
                <Select
                  value={
                    mobileMicroDistrict?.id
                      ? mobileMicroDistrict.id.toString()
                      : ""
                  }
                  onValueChange={handleMobileMicroDistrictChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите микрорайон" />
                  </SelectTrigger>
                  <SelectContent>
                    {microDistricts.map((m) => (
                      <SelectItem key={m.id} value={m.id.toString()}>
                        {m.namerus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button
            className={styles.confirmButton}
            onClick={() => setOpenDropdown(null)}
          >
            Выбрать
          </Button>
        </div>
      );
    }
  }

  const renderPriceDropdown = () => (
    <div className={styles.priceDropdown}>
      <h3>Выберите цену</h3>

      <div className={styles.priceInputs}>
        <Input
          placeholder="Минимальный"
          value={formatPrice(priceRange[0])}
          onChange={(e) => {
            const value =
              e.target.value === ""
                ? 0
                : parseInt(e.target.value.replace(/\D/g, ""));
            if (!isNaN(value)) {
              dispatch(setPriceRange([value, priceRange[1]]));
            }
          }}
        />
        <Input
          placeholder="Максимальный"
          value={formatPrice(priceRange[1])}
          onChange={(e) => {
            const value =
              e.target.value === ""
                ? 0
                : parseInt(e.target.value.replace(/\D/g, ""));
            if (!isNaN(value)) {
              dispatch(setPriceRange([priceRange[0], value]));
            }
          }}
        />
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.sliderLabels}>
          <span>0</span>
          <span>500 000</span>
        </div>
        <Slider
          defaultValue={[priceRange[0], priceRange[1]]}
          min={0}
          max={500000}
          step={5000}
          onValueChange={(newValue) => {
            dispatch(setPriceRange(newValue as [number, number]));
          }}
          className={styles.priceSlider}
        />
      </div>

      <div className={styles.actionContent}>
        <Button
          className={styles.confirmButton}
          onClick={() => setOpenDropdown(null)}
        >
          Применить
        </Button>
      </div>
    </div>
  );

  const renderGenderDropdown = () => (
    <div className={styles.genderDropdown}>
      <h3>Выберите пол</h3>

      <ul>
        {genderOptions.map((g) => (
          <Button
            key={g.id}
            variant={gender?.code === g.code ? "default" : "ghost"}
            className={styles.genderItem}
            onClick={() => {
              dispatch(setGender(g));
              setOpenDropdown(null);
            }}
          >
            {g.namerus}
          </Button>
        ))}
      </ul>
    </div>
  );

  const renderRoommatesDropdown = () => (
    <div className={styles.roommatesDropdown}>
      <h3>Количество сожителей</h3>

      <ul className={styles.roommatesList}>
        {roommateOptions.map((r) => (
          <Button
            key={r.id}
            variant={roommates?.id === r.id ? "default" : "ghost"}
            className={styles.roommateItem}
            onClick={() => {
              dispatch(setRoommates(r));
              setOpenDropdown(null);
            }}
          >
            {r.name}
          </Button>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={styles.searchBarWrapper}>
      <form onSubmit={handleSearch} className={styles.searchBarForm}>
        <div className={styles.searchItems}>
          <DropdownMenu
            open={openDropdown === "address"}
            onOpenChange={(open) => {
              if (open) setOpenDropdown("address");
              else if (openDropdown === "address") setOpenDropdown(null);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={styles.searchItem}
                onClick={() => toggleDropdown("address")}
              >
                <MapPin size={getIconSize()} className="mr-2" />
                <span>{getAddressDisplay()}</span>
                <ChevronDown size={getIconSize()} className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.customDropdown}>
              {renderAddressDropdown()}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu
            open={openDropdown === "price"}
            onOpenChange={(open) => {
              if (open) setOpenDropdown("price");
              else if (openDropdown === "price") setOpenDropdown(null);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={styles.searchItem}
                onClick={() => toggleDropdown("price")}
              >
                <DollarSign size={getIconSize()} className="mr-2" />
                <span>{`${formatPrice(priceRange[0])} - ${formatPrice(
                  priceRange[1]
                )}`}</span>
                <ChevronDown size={getIconSize()} className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.customDropdown}>
              {renderPriceDropdown()}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu
            open={openDropdown === "gender"}
            onOpenChange={(open) => {
              if (open) setOpenDropdown("gender");
              else if (openDropdown === "gender") setOpenDropdown(null);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={styles.searchItem}
                onClick={() => toggleDropdown("gender")}
              >
                <User size={getIconSize()} className="mr-2" />
                <span>{gender?.namerus || "Выберите пол"}</span>
                <ChevronDown size={getIconSize()} className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.customDropdown}>
              {renderGenderDropdown()}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu
            open={openDropdown === "roommates"}
            onOpenChange={(open) => {
              if (open) setOpenDropdown("roommates");
              else if (openDropdown === "roommates") setOpenDropdown(null);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={styles.searchItem}
                onClick={() => toggleDropdown("roommates")}
              >
                <Users size={getIconSize()} className="mr-2" />
                <span>
                  {roommates
                    ? `${roommates.name} человек`
                    : "Количество сожителей"}
                </span>
                <ChevronDown size={getIconSize()} className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.customDropdown}>
              {renderRoommatesDropdown()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          type="submit"
          size={isMobile ? "default" : "icon"}
          className={styles.searchButton}
        >
          {isMobile && <span>Поиск</span>}
          <Search size={isSmallMobile ? 16 : 18} />
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
