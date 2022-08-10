#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include "main.h"

/**
 * _printf - produces output according to a format
 *  @format: a string containing normal
 *  sequence(s) of characters to print as-is, and
 *  special character sequence(s) to determine how to print the next arguments.
 *
 *  Return: the number of characters printed,
 *  excluding the string-terminating null character
 */
int _printf(const char *format, ...)
{
	int i, bytes_written = 0;
	va_list ap;

	if (format == NULL)
		return (0);
	va_start(ap, format);	/*initialize argument pointer*/
	for (i = 0; format[i]; i++)
	{
		if (format[i] == '%')	/*when a % character is encountered*/
		{
			/*bytes_written stores the number of bytes*/
			/*written by the call to each function*/
			switch (format[++i])
			{
				case 'c':
					bytes_written += printc(va_arg(ap, int));
					break;
				case 's':
					bytes_written += prints(va_arg(ap, char *));
					break;
				case '%':
					bytes_written += write(1, "%", 1);
					break;
				case 'b':
					bytes_written += printbin(va_arg(ap, unsigned int));
					break;
				case 'd':
				case 'i':
					bytes_written += printid(va_arg(ap, int));
					break;
				default:
					bytes_written += write(1, (format + i), 1);
			}
		}
		else
		{
			bytes_written += write(1, (format + i), 1);
		}
	}
	va_end(ap);
	return (bytes_written);
}
