import * as Location from 'expo-location'
import React, { useState, useEffect, useContext } from 'react'
import {
  Box,
  Breadcrumbs,
  Button,
  FlexFull,
  Layout,
  Text,
} from '../../components/Themed'
import { getGroupData, getItem, setItem } from '../../hooks'
import { View } from 'react-native'
import * as TaskManager from 'expo-task-manager'
import haversine from 'haversine'
import axios from 'axios'
import { AuthContext } from '../../hooks/context'
import { useNavigation } from '@react-navigation/native'

export default () => {
  const [distance, setDistance] = useState(0)
  const [coords, setCoords] = useState<{
    longitude: number | undefined
    latitude: number | undefined
  }>({
    longitude: undefined,
    latitude: undefined,
  })
  const [distanceFormat, setDistanceFormat] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [log, setLog] = useState('')
  const { retrieveData } = useContext(AuthContext)
  const { navigate } = useNavigation()
  useEffect(() => {
    ;(async () => {
      let data = await getGroupData()

      setDistanceFormat(data.distance)

      const cachedDistance = await getItem('gpsDistance')
      if (cachedDistance && parseFloat(cachedDistance) > 0) {
        setDistance(parseFloat(cachedDistance))
        setIsTracking(true)
      }
    })()
  }, [])

  const toggleTracking = async () => {
    setIsTracking((isTracking) => !isTracking)
    if (isTracking) {
      setCoords({
        longitude: undefined,
        latitude: undefined,
      })
      await Location.stopLocationUpdatesAsync('gpsTracking')
      return
    }
    startTracking()
  }

  const startTracking = async () => {
    if (!(await requestForeground()) || !(await requestBackground())) {
      // setErrorMsg("Permission to access location was denied");
      return
    }
    await Location.stopLocationUpdatesAsync('gpsTracking')
    setDistance(0)
    await setItem('gpsDistance', '0')
    setLog('adding task')
    await Location.startLocationUpdatesAsync('gpsTracking', {
      accuracy: Location.Accuracy.BestForNavigation,
      activityType: Location.ActivityType.AutomotiveNavigation,
      foregroundService: {
        notificationTitle: 'Tracking GPS distance!',
        notificationBody:
          "Don't forget to turn it off when your trip is complete!",
      },
    })
  }

  TaskManager.defineTask(
    'gpsTracking',
    async ({ data: { locations }, error }) => {
      if (error) {
        setLog(error.message)

        // check `error.message` for more details.
        return
      }
      console.log(coords, {
        longitude: locations[0].coords.longitude,
        latitude: locations[0].coords.latitude,
      })
      setLog(
        JSON.stringify({
          longitude: locations[0].coords.longitude,
          latitude: locations[0].coords.latitude,
        }),
      )
      if (coords.latitude !== undefined && coords.longitude !== undefined) {
        const calcDistance = haversine(
          coords,
          {
            longitude: locations[0].coords.longitude,
            latitude: locations[0].coords.latitude,
          },
          { unit: distanceFormat != 'km' ? 'mile' : 'km' },
        )
        setDistance(distance + calcDistance)
        await setItem('gpsDistance', distance + calcDistance)
        setLog(calcDistance)
        console.log(calcDistance)
      }

      setCoords({
        longitude: locations[0].coords.longitude,
        latitude: locations[0].coords.latitude,
      })
      // console.log("Received new locations", locations);
    },
  )

  const requestForeground = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      // setErrorMsg("Permission to access location was denied");
      return false
    } else {
      return true
    }
  }
  const requestBackground = async () => {
    let { status } = await Location.requestBackgroundPermissionsAsync()
    if (status !== 'granted') {
      // setErrorMsg("Permission to access location was denied");
      return false
    } else {
      return true
    }
  }

  const saveDistance = async () => {
    // setLoading(true);
    if (distance === 0) return
    axios
      .post((process.env as any).REACT_APP_API_ADDRESS + `/distance/add`, {
        distance: distance,
        authenticationKey: retrieveData().authenticationKey,
      })
      .then(async () => {
        await setItem('showToast', 'distanceUpdated')
        navigate('Dashboard')
      })
      .catch(({ response }) => {
        console.log(response.message)
      })
  }

  return (
    <Layout>
      <Breadcrumbs
        links={[
          { name: 'Dashboard' },
          { name: 'Manage Distance', screenName: 'ManageDistance' },
          { name: 'GPS Tracking' },
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
              in the background in order to track your distance
            </Text>
          </Box>
          <Text style={{ fontSize: 18 }}>Distance Travelled:</Text>
          <Text style={{ fontSize: 32, marginTop: 10, fontWeight: 'bold' }}>
            {distance.toFixed(2)} {distanceFormat}
          </Text>
          <Text>{log}</Text>
        </View>
        <View>
          <Button handleClick={toggleTracking} styles={{ marginBottom: 20 }}>
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
          <Button
            disabled={isTracking}
            handleClick={saveDistance}
            style={'ghost'}
          >
            Save Distance
          </Button>
        </View>
      </FlexFull>
    </Layout>
  )
}
