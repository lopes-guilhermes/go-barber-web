/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { isToday, format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

import { 
  Container, 
  Header, 
  HeaderContent, 
  Profile, 
  Content, 
  Schedule, 
  NextAppointment, 
  Section,
  Appointment,
  Calendar 
} from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
};

interface Appointment {
  id: string;
  date: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, [setSelectedDate]);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, [setCurrentMonth]);

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1
      }
    }).then(response => {
      setMonthAvailability(response.data);
    });
  }, [currentMonth, setMonthAvailability, user.id]); 

  useEffect(() => {
    api.get('/appointments/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      }
    }).then((response) => {
      setAppointments(response.data);
    });
  }, [selectedDate]);
  
  const disableDays = useMemo(() => {
    const dates = monthAvailability
    .filter(monthDay => monthDay.available === false)
    .map(monthDay => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      return new Date(year, month, monthDay.day);
    });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBr });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBr});
  }, [selectedDate]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
            <button type="button" onClick={signOut}>
              <FiPower />
            </button>
          </Profile>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img src={user.avatar_url} alt={user.name} />
              <strong>{user.name}</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img src={user.avatar_url} alt={user.name} />
                <strong>{user.name}</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img src={user.avatar_url} alt={user.name} />
                <strong>{user.name}</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img src={user.avatar_url} alt={user.name} />
                <strong>{user.name}</strong>
              </div>
            </Appointment>
          </Section>

          <Section>
            <strong>Tarde</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img src={user.avatar_url} alt={user.name} />
                <strong>{user.name}</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img src={user.avatar_url} alt={user.name} />
                <strong>{user.name}</strong>
              </div>
            </Appointment>
          </Section>

        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[
              { daysOfWeek: [0, 6] },
              ...disableDays
            ]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5 ]}
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro'
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
}

export default Dashboard;