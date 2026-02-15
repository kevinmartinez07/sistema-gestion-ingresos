import {
  DomainEventDispatcher,
  UserNameUpdatedEvent,
  UserPhoneUpdatedEvent,
  UserRoleChangedEvent,
} from '../events';
import { Email } from '../value-objects/Email';
import { Phone } from '../value-objects/Phone';
import { Role } from '../value-objects/Role';

export class User {
  private readonly _email: Email;
  private _phone?: Phone;

  constructor(
    public readonly id: string,
    public name: string,
    emailValue: string,
    public readonly emailVerified: boolean,
    public role: Role,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public image?: string,
    phoneValue?: string
  ) {
    this._email = Email.create(emailValue);
    this._phone = Phone.createOptional(phoneValue);
  }

  /**
   * Factory method para crear un usuario con validación completa
   */
  static create(props: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    image?: string;
    phone?: string;
  }): User {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }

    if (props.name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (props.name.trim().length > 100) {
      throw new Error('El nombre no puede exceder 100 caracteres');
    }

    return new User(
      props.id,
      props.name.trim(),
      props.email,
      props.emailVerified,
      props.role,
      props.createdAt,
      props.updatedAt,
      props.image,
      props.phone
    );
  }

  get email(): string {
    return this._email.value;
  }

  get phone(): string | undefined {
    return this._phone?.value;
  }

  set phone(value: string | undefined) {
    this._phone = Phone.createOptional(value);
  }

  get emailVO(): Email {
    return this._email;
  }

  get phoneVO(): Phone | undefined {
    return this._phone;
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  canManageUsers(): boolean {
    return this.isAdmin();
  }

  canAccessReports(): boolean {
    return this.isAdmin();
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }

    if (newName.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (newName.trim().length > 100) {
      throw new Error('El nombre no puede exceder 100 caracteres');
    }

    const previousName = this.name;
    this.name = newName.trim();
    this.updatedAt = new Date();

    DomainEventDispatcher.dispatch(
      new UserNameUpdatedEvent(this.id, previousName, this.name)
    );
  }

  updateRole(newRole: Role): void {
    const previousRole = this.role;
    this.role = newRole;
    this.updatedAt = new Date();

    if (previousRole !== newRole) {
      DomainEventDispatcher.dispatch(
        new UserRoleChangedEvent(this.id, previousRole, newRole)
      );
    }
  }

  updatePhone(newPhone?: string): void {
    this._phone = newPhone ? Phone.create(newPhone.trim()) : undefined;
    this.updatedAt = new Date();

    DomainEventDispatcher.dispatch(
      new UserPhoneUpdatedEvent(this.id, this._phone?.value)
    );
  }
}
