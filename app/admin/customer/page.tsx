import { redirect } from 'next/navigation';

export default function CustomerRedirect() {
  redirect('/admin/customers');
}