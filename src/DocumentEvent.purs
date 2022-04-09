module DocumentEvent
  (addEvent
  , EventHandler
  , EventType
  , clickEvent
  , inputEvent
  , getCurrentWeather
  , getMinuteWeather
  ) where

import Prelude

import Effect (Effect)
import Web.Event.Event (Event)

type EventHandler = Event -> Effect Unit

foreign import data EventType :: Type

foreign import clickEvent :: EventType

foreign import inputEvent :: EventType

foreign import addEvent :: EventType -> EventHandler -> Effect Unit

foreign import getCurrentWeather :: Effect Unit

foreign import getMinuteWeather :: Effect Unit