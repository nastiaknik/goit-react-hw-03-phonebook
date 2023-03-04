import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from 'components/Layout/Layout';
import { Section } from 'components/Section/Section';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { ContactFilter } from './ContactFilter/ContactFilter';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
    favourites: [],
  };

  componentDidMount() {
    const parsedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
    const savedFavourites = JSON.parse(localStorage.getItem('favourites'));
    if (savedFavourites) {
      this.setState({ favourites: savedFavourites });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
    if (this.state.favourites !== prevState.favourites) {
      localStorage.setItem('favourites', JSON.stringify(this.state.favourites));
    }
  }

  addContact = contact => {
    if (
      this.state.contacts.some(item => {
        return item.name === contact.name;
      })
    ) {
      toast.warning(
        <p>
          Contact <span style={{ color: 'orange' }}>{contact.name}</span>{' '}
          already exist!
        </p>
      );
      return;
    }
    if (
      this.state.contacts.some(item => {
        return item.number === contact.number;
      })
    ) {
      toast.warning(
        <p>
          Number <span style={{ color: 'orange' }}>{contact.number}</span> is
          already in base!
        </p>
      );
      return;
    }
    this.setState(({ contacts }) => ({
      contacts: [...contacts, contact],
    }));
    toast.success(
      <p>
        Contact <span style={{ color: 'green' }}>{contact.name}</span> added!
      </p>
    );
  };

  deleteContact = contact => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(({ id }) => id !== contact.id),
    }));
    toast.success(
      <p>
        Contact <span style={{ color: 'green' }}>{contact.name}</span> deleted!
      </p>
    );
  };

  addContactToFav = contact => {
    if (this.state.favourites.some(fav => fav.id === contact.id)) {
      this.setState(({ favourites }) => ({
        favourites: favourites.filter(({ id }) => id !== contact.id),
      }));
      toast.success(
        <p>
          Contact <span style={{ color: 'green' }}>{contact.name}</span> removed
          from favourites!
        </p>
      );
      return;
    }
    this.setState(({ favourites }) => ({
      favourites: [
        ...favourites.filter(({ id }) => id !== contact.id),
        contact,
      ],
    }));
    toast.success(
      <p>
        Contact <span style={{ color: 'green' }}>{contact.name}</span> added to
        favourites!
      </p>
    );
  };

  handleSetFilterValue = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  };

  handleFilterContact = () => {
    if (
      this.state.contacts.filter(contact => {
        return (
          contact.name
            .toLowerCase()
            .includes(this.state.filter.toLowerCase().trim()) ||
          contact.number.includes(this.state.filter.trim())
        );
      }).length === 0
    ) {
      toast.error('Sorry, there are no contact matching your search :(', {
        toastId: 'dont-duplicate-pls',
      });
    }

    return this.state.contacts
      .filter(contact => {
        return (
          contact.name
            .toLowerCase()
            .includes(this.state.filter.toLowerCase().trim()) ||
          contact.number.includes(this.state.filter.trim())
        );
      })
      .sort((firstContact, secondContact) =>
        firstContact.name.localeCompare(secondContact.name)
      );
  };

  render() {
    return (
      <Layout>
        <Section title="Phonebook">
          <ContactForm onSubmit={this.addContact} />
        </Section>
        {this.state.contacts.length > 0 && (
          <Section title="Contacts">
            <ContactFilter
              value={this.state.filter}
              onFilter={this.handleSetFilterValue}
            />
            <ContactList
              contacts={this.handleFilterContact()}
              onDelete={this.deleteContact}
              onFavorite={this.addContactToFav}
              favourites={this.state.favourites}
            />
          </Section>
        )}
        <ToastContainer newestOnTop={true} limit={5} autoClose={3000} />
      </Layout>
    );
  }
}
