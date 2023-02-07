import Geolocation from '@react-native-community/geolocation'
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
import { View } from 'react-native'
import Layout from '../../components/layout'
import axios from 'axios'
import { AuthContext } from '../../hooks/context'
import { useNavigation } from '@react-navigation/native'
import config from '../../config'
import haversine from 'haversine'

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
      const cachedDistance = await getItem('gpsDistance')
      if (cachedDistance && parseFloat(cachedDistance) > 0) {
        setDistance(parseFloat(cachedDistance))
        setIsTracking(true)
      }
    })()
  }, [])

  useEffect(() => {
    ; (async () => {
      if (await getItem('trackingRef')) {
        setIsTracking(true)
      }
    })()
  }, [])

  useEffect(() => {
    if (!isTracking) return
    const timer = setInterval(async () => {
      if (!isTracking) return
      await updateDistance()
    }, 300)
    return () => clearInterval(timer)
  }, [isTracking])

  const updateDistance = async () => {
    let currDistance = await getItem('gpsDistance')
    if (currDistance) setDistance(parseFloat(currDistance))
  }

  const testFunc = async () => {
    const oldData = await getItem('gpsOldData')
    Alert(
      'old coords',
      `${oldData || ''
      }  stored distance ${distance.toString()} actual distance ${distance.toString()} version idk`,
    )
  }

  const toggleTracking = async () => {
    if (isTracking) {
      const locationRef = await getItem('trackingRef')
      if (locationRef) {
        Geolocation.clearWatch(parseFloat(locationRef))
        await deleteItem('trackingRef')
      }
      setIsTracking(false)
      await setItem('gpsOldData', '')
      await setItem('tracking', 'false')
      await setItem('gpsDistance', '0')
      return
    }
    await startTracking()
  }

  const calculateDistance = async (latitude: number, longitude: number) => {
    const oldData = await getItem('gpsOldData')
    if (!oldData)
      return await setItem(
        'gpsOldData',
        JSON.stringify({ latitude: latitude, longitude: longitude }),
      )
    const currDistance: { longitude: number; latitude: number } = JSON.parse(
      oldData,
    )
    let currDistanceNumber = parseFloat((await getItem('gpsDistance')) || '0')

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
    await setItem(
      'gpsOldData',
      JSON.stringify({ latitude: latitude, longitude: longitude }),
    )
    await setItem('gpsDistance', (currDistanceNumber + calcDistance).toString())
  }

  const startTracking = async () => {
    try {
      await requestForeground()
      await requestBackground()
      await requestLocation()
    } catch (err) {
      console.log(err)
      return Alert('Please turn on your GPS services!')
    }

    setIsTracking(true)
    setDistance(0)
    await setItem('gpsDistance', '0')
    await setItem('tracking', 'true')

    Geolocation.getCurrentPosition(async (data) => {
      await setItem(
        'gpsOldData',
        JSON.stringify({
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
        }),
      )
    })

    const trackNumber = Geolocation.watchPosition(
      (success) => {
        calculateDistance(success.coords.latitude, success.coords.longitude)
      },
      (error) => {
        console.log(error)
        Alert('An error occured!', error.message)
      },
      {
        interval: 10,
        enableHighAccuracy: true,
        distanceFilter: 10,
        timeout: 400,
      },
    )

    await setItem('trackingRef', trackNumber.toString())
  }

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
