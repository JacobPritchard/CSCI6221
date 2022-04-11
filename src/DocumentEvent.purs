module DocumentEvent
  (addEvent
  , EventHandler
  , EventType
  , clickEvent
  , inputEvent
  , getPosition
  , getMinuteWeather
  , getHourlyWeather
  , getDailyWeather
  , getAlerts
  ) where

import Prelude

import Effect (Effect)
import Web.Event.Event (Event)

type EventHandler = Event -> Effect Unit

foreign import data EventType :: Type

foreign import clickEvent :: EventType

foreign import inputEvent :: EventType

foreign import addEvent :: EventType -> EventHandler -> Effect Unit

foreign import getPosition :: Effect Unit

foreign import getMinuteWeather :: Effect Unit

foreign import getHourlyWeather :: Effect Unit

foreign import getDailyWeather :: Effect Unit

foreign import getAlerts :: Effect Unit