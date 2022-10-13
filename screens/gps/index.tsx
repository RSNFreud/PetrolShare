import * as Location from "expo-location";
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  FlexFull,
  Text,
} from "../../components/Themed";
import { getGroupData, getItem, setItem } from "../../hooks";
import { View } from "react-native";
import Layout from "../../components/layout";
import axios from "axios";
import { AuthContext } from "../../hooks/context";
import { useNavigation } from "@react-navigation/native";
import config from "../../config";

export default () => {
  const [distance, setDistance] = useState(0);
  const [coords, setCoords] = useState<{
    longitude: string | undefined;
    latitude: string | undefined;
  }>({
    longitude: undefined,
    latitude: undefined,
  });
  const [distanceFormat, setDistanceFormat] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const { retrieveData } = useContext(AuthContext);
  const { navigate } = useNavigation();
  useEffect(() => {
    (async () => {
      let data = await getGroupData();

      setDistanceFormat(data.distance);

      const cachedDistance = await getItem("gpsDistance");
      if (cachedDistance && parseFloat(cachedDistance) > 0) {
        setDistance(parseFloat(cachedDistance));
        setIsTracking(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (await Location.hasStartedLocationUpdatesAsync("gpsTracking"))
        setIsTracking(true);
    })();
  }, []);

  useEffect(() => {
    if (!isTracking) return;
    const timer = setInterval(async () => {
      await calculateDistance();
    }, 300);
    return () => clearInterval(timer);
  }, [isTracking, coords]);

  const toggleTracking = async () => {
    if (isTracking) {
      setIsTracking(false);
      setCoords({
        longitude: undefined,
        latitude: undefined,
      });
      await setItem("gpsDistance", "0");
      if (await Location.hasStartedLocationUpdatesAsync("gpsTracking"))
        await Location.stopLocationUpdatesAsync("gpsTracking");
      return;
    }
    await startTracking();
  };

  const calculateDistance = async () => {
    let currDistance = await getItem("gpsDistance");

    if (currDistance) setDistance(parseFloat(currDistance));
  };

  const startTracking = async () => {
    if (!(await requestForeground()) || !(await requestBackground())) {
      // setErrorMsg("Permission to access location was denied");
      console.log("permission denied");

      return;
    }
    setIsTracking(true);
    setDistance(0);
    console.log("tracking started!");

    await setItem("gpsDistance", "0");
    await Location.getCurrentPositionAsync();
    await Location.startLocationUpdatesAsync("gpsTracking", {
      accuracy: Location.Accuracy.Highest,
      activityType: Location.ActivityType.AutomotiveNavigation,
      pausesUpdatesAutomatically: false,
      deferredUpdatesDistance: 10,
      foregroundService: {
        notificationTitle: "Tracking GPS distance!",
        notificationBody:
          "Don't forget to turn it off when your trip is complete!",
      },
    });
  };

  const requestForeground = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      // setErrorMsg("Permission to access location was denied");
      return false;
    } else {
      return true;
    }
  };
  const requestBackground = async () => {
    let { status } = await Location.requestBackgroundPermissionsAsync();

    if (status !== "granted") {
      // setErrorMsg("Permission to access location was denied");
      return false;
    } else {
      return true;
    }
  };

  const saveDistance = async () => {
    // setLoading(true);
    if (distance === 0) return;
    axios
      .post(config.REACT_APP_API_ADDRESS + `/distance/add`, {
        distance: distance,
        authenticationKey: retrieveData().authenticationKey,
      })
      .then(async () => {
        await setItem("showToast", "distanceUpdated");
        navigate("Dashboard");
      })
      .catch(({ response }) => {
        console.log(response.message);
      });
  };

  return (
    <Layout>
      <Breadcrumbs
        links={[
          { name: "Dashboard" },
          { name: "Manage Distance", screenName: "ManageDistance" },
          { name: "GPS Tracking" },
        ]}
      />
      <FlexFull>
        <View>
          <Box
            style={{
              paddingHorizontal: 15,
              paddingVertical: 15,
              marginBottom: 30,
            }}
          >
            <Text>
              By clicking Start Tracking, you agree to allow us to use your GPS
              in the background in order to track your distance. PetrolShare
              collects location data to enable GPS tracking even when the app is
              closed or not in use.
            </Text>
          </Box>
          <Text style={{ fontSize: 18 }}>Distance Travelled:</Text>
          <Text style={{ fontSize: 32, marginTop: 10, fontWeight: "bold" }}>
            {distance.toFixed(2)} {distanceFormat}
          </Text>
        </View>
        <View>
          <Button handleClick={toggleTracking} styles={{ marginBottom: 20 }}>
            {isTracking ? "Stop Tracking" : "Start Tracking"}
          </Button>
          <Button
            disabled={isTracking}
            handleClick={saveDistance}
            style={"ghost"}
          >
            Save Distance
          </Button>
        </View>
      </FlexFull>
    </Layout>
  );
};
