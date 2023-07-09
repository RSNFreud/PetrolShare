import Geolocation from 'react-native-geolocation-service'
import * as Location from 'expo-location'
import React, { useState, useEffect, useContext } from 'react'
import {
  Box,
  Breadcrumbs,
  Button,
  FlexFull,
  Text,
} from '../../components/Themed'
import Constants from 'expo-constants'
import { Alert, deleteItem, getGroupData, getItem, setItem } from '../../hooks'
import { Platform, ToastAndroid, View } from 'react-native'
import Layout from '../../components/Layout'
import axios from 'axios'
import { AuthContext } from '../../hooks/context'
import { useNavigation } from '@react-navigation/native'
import config from '../../config'
import haversine from 'haversine'

const parseData = (e?: string | null) => {
  if (!e)
    return {
      distance: '0',
      coords: {
        latitude: 0,
        longitude: 0,
      },
    }
  return JSON.parse(e) as {
    distance: string
    coords: {
      latitude: number
      longitude: number
    }
  }
}

export default () => {
  const [distance, setDistance] = useState(0)
  const [distanceFormat, setDistanceFormat] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const { retrieveData } = useContext(AuthContext)
  const { navigate } = useNavigation()
  useEffect(() => {
    ; (async () => {
      let data = await getGroupData()
      setDistanceFormat(data.distance)
      const cachedDistance = parseData(getItem('gpsData'))
      if (cachedDistance && parseFloat(cachedDistance.distance) > 0) {
        setDistance(parseFloat(cachedDistance.distance))
        setIsTracking(true)
      }
    })()
  }, [])

  useEffect(() => {
    ; (async () => {
      if (getItem('trackingRef')) {
        setIsTracking(true)
      }
    })()
  }, [])

  useEffect(() => {
    if (!isTracking) return
    const timer = setInterval(async () => {
      if (!isTracking) return
      await updateDistance()
    }, 100)
    return () => clearInterval(timer)
  }, [isTracking])

  const updateDistance = async () => {
    let currDistance = parseData(getItem('gpsData'))
    if (currDistance) setDistance(parseFloat(currDistance.distance))
  }

  const testFunc = async () => {
    const oldData = getItem('gpsData')
    Alert(
      'old coords',
      `${oldData || ''
      }  stored distance ${distance.toString()} actual distance ${distance.toString()} version: last try before i cry`,
    )
  }

  const toggleTracking = async () => {
    if (isTracking) {
      const locationRef = getItem('trackingRef')
      if (locationRef) {
        Geolocation.clearWatch(parseFloat(locationRef))
        deleteItem('trackingRef')
      }
      setIsTracking(false)
      setItem('tracking', 'false')
      setItem('gpsData', '')
      return
    }
    await startTracking()
  }

  const calculateDistance = async (latitude: number, longitude: number) => {
    // ToastAndroid.show('Triggered', ToastAndroid.SHORT)
    const oldData = parseData(getItem('gpsData'))
    if (!oldData)
      return setItem(
        'gpsData',
        JSON.stringify({
          distance: '0',
          coords: { latitude: latitude, longitude: longitude },
        }),
      )
    const currDistance: { longitude: number; latitude: number } = oldData.coords

    let currDistanceNumber = parseFloat(oldData.distance)

    const calcDistance = haversine(
      {
        longitude: currDistance.longitude,
        latitude: currDistance.latitude,
      },
      {
        longitude: longitude,
        latitude: latitude,
      },
      { unit: distanceFormat !== 'km' ? 'mile' : 'km' },
    )
    setItem(
      'gpsData',
      JSON.stringify({
        distance: (currDistanceNumber + calcDistance).toString(),
        coords: { latitude: latitude, longitude: longitude },
      }),
    )
  }

  const startTracking = async () => {
    try {
      await requestForeground()
      // await requestBackground()
      // await requestLocation()
    } catch (err) {
      console.log(err)
      return Alert('Please turn on your GPS services!')
    }

    setIsTracking(true)
    setDistance(0)
    setItem('tracking', 'true')

    Geolocation.getCurrentPosition(async (data) => {
      setItem(
        'gpsData',
        JSON.stringify({
          distance: '0',
          coords: {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
          },
        }),
      )
    })

    const trackNumber = Geolocation.watchPosition(
      (success: { coords: { latitude: number; longitude: number } }) => {
        calculateDistance(success.coords.latitude, success.coords.longitude)
      },
      (error: { message: string | undefined }) => {
        console.log(error)
        Alert('An error occured!', error.message)
        toggleTracking()
      },
      {
        accuracy: {
          ios: 'bestForNavigation',
          android: 'high',
        },
        interval: 10,
        enableHighAccuracy: true,
        distanceFilter: 15,
        forceLocationManager: true,
      },
    )

    setItem('trackingRef', trackNumber.toString())
  }

  const requestForeground = async () => {
    try {
      const status = await Geolocation.requestAuthorization('always')
      if (status || Platform.OS === 'android') return true
    } catch {
      return false
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

  const requestLocation = async () => {
    return new Promise((res, rej) => {
      Location.enableNetworkProviderAsync()
        .then(() => res('accepted'))
        .catch(() => rej('denied'))
    })
  }

  const saveDistance = async () => {
    // setLoading(true);
    if (distance === 0) return
    axios
      .post(config.REACT_APP_API_ADDRESS + `/distance/add`, {
        distance: distance,
        authenticationKey: retrieveData?.authenticationKey,
      })
      .then(async () => {
        setItem('showToast', 'distanceUpdated')
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
              in the background in order to track your distance. PetrolShare
              collects location data to enable GPS tracking even when the app is
              closed or not in use.
            </Text>
          </Box>
          <Text style={{ fontSize: 18 }}>Distance Travelled:</Text>
          <Text style={{ fontSize: 32, marginTop: 10, fontWeight: 'bold' }}>
            {distance.toFixed(1)} {distanceFormat}
          </Text>
          <Button handleClick={testFunc} styles={{ marginTop: 20 }}>
            Test!
          </Button>
        </View>
        <View>
          <Button handleClick={toggleTracking} styles={{ marginBottom: 20 }}>
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
          <Button
            disabled={isTracking || distance <= 0}
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
