import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BasicInfo } from '@/types/comprehensive-medical-form';
import { calculateAgeFromDate } from '@/lib/date-utils';

// Validation schema for BasicInfo
const basicInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'non-binary', 'other', 'prefer-not-to-say']),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'separated', 'domestic-partner']),
  phone: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required').max(2, 'State must be 2 characters'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    country: z.string().optional(),
  }),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Invalid phone number'),
    address: z.string().optional(),
  }),
  insurance: z.object({
    provider: z.string().min(1, 'Insurance provider is required'),
    policyNumber: z.string().min(1, 'Policy number is required'),
    groupNumber: z.string().optional(),
    subscriberName: z.string().min(1, 'Subscriber name is required'),
    subscriberId: z.string().min(1, 'Subscriber ID is required'),
  }),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  dominantHand: z.enum(['right', 'left', 'ambidextrous']),
  livingArrangement: z.enum(['alone', 'family', 'assisted-living', 'nursing-home', 'other']),
  primaryLanguage: z.string().min(1, 'Primary language is required'),
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface BasicInfoFormProps {
  data?: Partial<BasicInfo>;
  onUpdate: (data: Partial<BasicInfo>) => void;
  onNext: () => void;
  onPrevious?: () => void;
}

export function BasicInfoForm({ data, onUpdate, onNext, onPrevious }: BasicInfoFormProps) {
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      middleName: data?.middleName || '',
      dateOfBirth: data?.dateOfBirth || '',
      gender: data?.gender || 'prefer-not-to-say',
      maritalStatus: data?.maritalStatus || 'single',
      phone: data?.phone || '',
      email: data?.email || '',
      address: {
        street: data?.address?.street || '',
        city: data?.address?.city || '',
        state: data?.address?.state || '',
        zipCode: data?.address?.zipCode || '',
        country: data?.address?.country || 'USA',
      },
      emergencyContact: {
        name: data?.emergencyContact?.name || '',
        relationship: data?.emergencyContact?.relationship || '',
        phone: data?.emergencyContact?.phone || '',
        address: data?.emergencyContact?.address || '',
      },
      insurance: {
        provider: data?.insurance?.provider || '',
        policyNumber: data?.insurance?.policyNumber || '',
        groupNumber: data?.insurance?.groupNumber || '',
        subscriberName: data?.insurance?.subscriberName || '',
        subscriberId: data?.insurance?.subscriberId || '',
      },
      occupation: data?.occupation || '',
      employer: data?.employer || '',
      dominantHand: data?.dominantHand || 'right',
      livingArrangement: data?.livingArrangement || 'family',
      primaryLanguage: data?.primaryLanguage || 'English',
    },
    mode: 'onChange',
  });

  // Watch date of birth to calculate age
  const dateOfBirth = watch('dateOfBirth');
  
  React.useEffect(() => {
    if (dateOfBirth) {
      const age = calculateAgeFromDate(dateOfBirth);
      setCalculatedAge(age);
    }
  }, [dateOfBirth]);

  const onSubmit = (formData: BasicInfoFormData) => {
    const updatedData: BasicInfo = {
      ...formData,
      age: calculatedAge || undefined,
    };
    onUpdate(updatedData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Please provide your personal information and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Demographics */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Demographics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" {...register('middleName')} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                    className={errors.dateOfBirth ? 'border-red-500' : ''}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                  )}
                  {calculatedAge !== null && (
                    <p className="text-sm text-gray-500">Age: {calculatedAge} years</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    {...register('gender')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <select
                    id="maritalStatus"
                    {...register('maritalStatus')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                    <option value="domestic-partner">Domestic Partner</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    {...register('phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Address</h4>
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    {...register('address.street')}
                    className={errors.address?.street ? 'border-red-500' : ''}
                  />
                  {errors.address?.street && (
                    <p className="text-sm text-red-500">{errors.address.street.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register('address.city')}
                      className={errors.address?.city ? 'border-red-500' : ''}
                    />
                    {errors.address?.city && (
                      <p className="text-sm text-red-500">{errors.address.city.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      maxLength={2}
                      placeholder="CA"
                      {...register('address.state')}
                      className={errors.address?.state ? 'border-red-500' : ''}
                    />
                    {errors.address?.state && (
                      <p className="text-sm text-red-500">{errors.address.state.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      placeholder="12345"
                      {...register('address.zipCode')}
                      className={errors.address?.zipCode ? 'border-red-500' : ''}
                    />
                    {errors.address?.zipCode && (
                      <p className="text-sm text-red-500">{errors.address.zipCode.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" {...register('address.country')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dominantHand">Dominant Hand</Label>
                  <select
                    id="dominantHand"
                    {...register('dominantHand')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                    <option value="ambidextrous">Ambidextrous</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="livingArrangement">Living Arrangement</Label>
                  <select
                    id="livingArrangement"
                    {...register('livingArrangement')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="family">With Family</option>
                    <option value="alone">Alone</option>
                    <option value="assisted-living">Assisted Living</option>
                    <option value="nursing-home">Nursing Home</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryLanguage">Primary Language *</Label>
                  <Input
                    id="primaryLanguage"
                    {...register('primaryLanguage')}
                    className={errors.primaryLanguage ? 'border-red-500' : ''}
                  />
                  {errors.primaryLanguage && (
                    <p className="text-sm text-red-500">{errors.primaryLanguage.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" {...register('occupation')} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employer">Employer</Label>
                  <Input id="employer" {...register('employer')} />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              {onPrevious && (
                <Button type="button" variant="outline" onClick={onPrevious}>
                  Previous
                </Button>
              )}
              <div className="ml-auto">
                <Button type="submit" disabled={!isValid}>
                  Next: Medical History
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Emergency Contact Card */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>
            Please provide emergency contact information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Contact Name *</Label>
              <Input
                id="emergencyName"
                {...register('emergencyContact.name')}
                className={errors.emergencyContact?.name ? 'border-red-500' : ''}
              />
              {errors.emergencyContact?.name && (
                <p className="text-sm text-red-500">{errors.emergencyContact.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyRelationship">Relationship *</Label>
              <Input
                id="emergencyRelationship"
                {...register('emergencyContact.relationship')}
                className={errors.emergencyContact?.relationship ? 'border-red-500' : ''}
              />
              {errors.emergencyContact?.relationship && (
                <p className="text-sm text-red-500">{errors.emergencyContact.relationship.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Phone Number *</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                placeholder="(555) 123-4567"
                {...register('emergencyContact.phone')}
                className={errors.emergencyContact?.phone ? 'border-red-500' : ''}
              />
              {errors.emergencyContact?.phone && (
                <p className="text-sm text-red-500">{errors.emergencyContact.phone.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyAddress">Address</Label>
              <Input id="emergencyAddress" {...register('emergencyContact.address')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Information</CardTitle>
          <CardDescription>
            Please provide your insurance details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
              <Input
                id="insuranceProvider"
                {...register('insurance.provider')}
                className={errors.insurance?.provider ? 'border-red-500' : ''}
              />
              {errors.insurance?.provider && (
                <p className="text-sm text-red-500">{errors.insurance.provider.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number *</Label>
              <Input
                id="policyNumber"
                {...register('insurance.policyNumber')}
                className={errors.insurance?.policyNumber ? 'border-red-500' : ''}
              />
              {errors.insurance?.policyNumber && (
                <p className="text-sm text-red-500">{errors.insurance.policyNumber.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="groupNumber">Group Number</Label>
              <Input id="groupNumber" {...register('insurance.groupNumber')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subscriberName">Subscriber Name *</Label>
              <Input
                id="subscriberName"
                {...register('insurance.subscriberName')}
                className={errors.insurance?.subscriberName ? 'border-red-500' : ''}
              />
              {errors.insurance?.subscriberName && (
                <p className="text-sm text-red-500">{errors.insurance.subscriberName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subscriberId">Subscriber ID *</Label>
              <Input
                id="subscriberId"
                {...register('insurance.subscriberId')}
                className={errors.insurance?.subscriberId ? 'border-red-500' : ''}
              />
              {errors.insurance?.subscriberId && (
                <p className="text-sm text-red-500">{errors.insurance.subscriberId.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
