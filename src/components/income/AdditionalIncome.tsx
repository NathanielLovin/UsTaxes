import React, { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Avatar, Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { PagerContext } from '../pager'
import { TaxesState, Person, PersonRole } from '../../redux/data'
import DeleteIcon from '@material-ui/icons/Delete'
import { Currency, GenericLabeledDropdown, LabeledInput } from '../input'
import { Patterns } from '../Patterns'


